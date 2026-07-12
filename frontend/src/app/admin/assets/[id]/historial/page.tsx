"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Asset, AssetMovement, Custodian, Location, MovementStatus } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ArrowRight, FileText, Plus, CheckCircle, XCircle, Clock } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const STATUS_CONFIG: Record<MovementStatus, { label: string; icon: React.ElementType; class: string }> = {
  PENDIENTE:  { label: "Pendiente",  icon: Clock,        class: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  COMPLETADO: { label: "Completado", icon: CheckCircle,  class: "text-green-700 bg-green-50 border-green-200" },
  RECHAZADO:  { label: "Rechazado",  icon: XCircle,      class: "text-red-700 bg-red-50 border-red-200" },
};

function StatusBadge({ status }: { status: MovementStatus }) {
  const { label, icon: Icon, class: cls } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

export default function HistorialPage() {
  const { id } = useParams<{ id: string }>();
  const assetId = parseInt(id);
  const { user } = useAuth();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [movements, setMovements] = useState<AssetMovement[]>([]);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const [form, setForm] = useState({ toCustodianId: "", toLocationId: "", note: "", acta: null as File | null });
  const [confirmForm, setConfirmForm] = useState({ note: "", acta: null as File | null });

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    Promise.all([
      api.assets.getById(assetId),
      api.movements.getByAsset(assetId),
      api.custodians.getAll(),
      api.locations.getAll(),
    ])
      .then(([a, m, c, l]) => { setAsset(a); setMovements(m); setCustodians(c); setLocations(l); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [assetId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      if (form.toCustodianId) fd.append("toCustodianId", form.toCustodianId);
      if (form.toLocationId) fd.append("toLocationId", form.toLocationId);
      if (form.note) fd.append("note", form.note);
      if (form.acta) fd.append("acta", form.acta);
      const newMovement = await api.movements.create(assetId, fd);
      setMovements((prev) => [newMovement, ...prev]);
      setForm({ toCustodianId: "", toLocationId: "", note: "", acta: null });
      setShowForm(false);
    } catch (error: any) {
      alert(error?.message || "Error al registrar traspaso");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirm(movementId: number) {
    setSaving(true);
    try {
      const fd = new FormData();
      if (confirmForm.note) fd.append("note", confirmForm.note);
      if (confirmForm.acta) fd.append("actaRecepcion", confirmForm.acta);
      const updated = await api.movements.confirm(assetId, movementId, fd);
      setMovements((prev) => prev.map((m) => (m.id === movementId ? updated : m)));
      const updatedAsset = await api.assets.getById(assetId);
      setAsset(updatedAsset);
      setConfirmingId(null);
      setConfirmForm({ note: "", acta: null });
    } catch (error: any) {
      alert(error?.message || "Error al confirmar recepción");
    } finally {
      setSaving(false);
    }
  }

  async function handleReject(movementId: number) {
    if (!confirm("¿Rechazar este traspaso? El bien permanecerá con el custodio actual.")) return;
    setSaving(true);
    try {
      const updated = await api.movements.reject(assetId, movementId);
      setMovements((prev) => prev.map((m) => (m.id === movementId ? updated : m)));
    } catch (error: any) {
      alert(error?.message || "Error al rechazar traspaso");
    } finally {
      setSaving(false);
    }
  }

  const canInitiate = isAdmin || (!!user?.custodianId && asset?.custodianId === user?.custodianId);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!asset) return <div className="p-6">Activo no encontrado</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/admin/assets/${assetId}`}>
          <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Historial de Traspasos</h1>
          <p className="text-muted-foreground">
            {asset.assetName}{asset.code ? ` — ${asset.code}` : ""}
          </p>
        </div>
        {canInitiate && (
          <Button className="ml-auto" onClick={() => setShowForm((v) => !v)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Traspaso
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle>Iniciar Traspaso</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Custodio receptor</Label>
                  <select className={SELECT_CLASS} value={form.toCustodianId} onChange={(e) => setForm({ ...form, toCustodianId: e.target.value })}>
                    <option value="">Sin cambio de custodio</option>
                    {custodians.map((c) => <option key={c.id} value={c.id}>{c.fullName} ({c.identifier})</option>)}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Ubicación destino</Label>
                  <select className={SELECT_CLASS} value={form.toLocationId} onChange={(e) => setForm({ ...form, toLocationId: e.target.value })}>
                    <option value="">Sin cambio de ubicación</option>
                    {locations.map((l) => <option key={l.id} value={l.id}>{[l.canton, l.parroquia].filter(Boolean).join(" / ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Observaciones</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Motivo del traspaso, estado del bien, etc."
                />
              </div>
              <div className="grid gap-2">
                <Label>Acta de entrega (PDF, JPG o PNG, máx. 10 MB)</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setForm({ ...form, acta: e.target.files?.[0] ?? null })} />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "Guardando..." : "Registrar Traspaso"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Movimientos ({movements.length})</CardTitle></CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No hay traspasos registrados.</p>
          ) : (
            <div className="space-y-3">
              {movements.map((m) => {
                const isPending = m.status === "PENDIENTE";
                const canAct = isPending && (isAdmin || user?.custodianId === m.toCustodianId);
                const isConfirming = confirmingId === m.id;

                return (
                  <div key={m.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">
                            {new Date(m.createdAt).toLocaleDateString("es-EC", { year: "numeric", month: "short", day: "numeric" })}
                          </span>
                          <StatusBadge status={m.status} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">Custodio:</span>
                          <CustodianChange from={m.fromCustodian?.fullName} to={m.toCustodian?.fullName} />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">Ubicación:</span>
                          <LocationChange
                            from={[m.fromLocation?.canton, m.fromLocation?.parroquia].filter(Boolean).join(" / ")}
                            to={[m.toLocation?.canton, m.toLocation?.parroquia].filter(Boolean).join(" / ")}
                          />
                        </div>
                        {m.note && <p className="text-muted-foreground">{m.note}</p>}
                      </div>
                      <div className="flex flex-col gap-1 items-end text-xs text-muted-foreground shrink-0">
                        {m.actaUrl && (
                          <a href={`${BACKEND_URL}${m.actaUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <FileText className="w-3.5 h-3.5" /> Acta de entrega
                          </a>
                        )}
                        {m.actaRecepcionUrl && (
                          <a href={`${BACKEND_URL}${m.actaRecepcionUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                            <FileText className="w-3.5 h-3.5" /> Acta de recepción
                          </a>
                        )}
                        <span>Iniciado por: {m.registeredBy?.name ?? "—"}</span>
                        {m.confirmedBy && <span>Confirmado por: {m.confirmedBy.name}</span>}
                      </div>
                    </div>

                    {canAct && !isConfirming && (
                      <div className="flex gap-2 pt-1 border-t">
                        <Button size="sm" onClick={() => setConfirmingId(m.id)}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Confirmar recepción
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => handleReject(m.id)} disabled={saving}>
                          <XCircle className="w-3.5 h-3.5 mr-1.5" /> Rechazar
                        </Button>
                      </div>
                    )}

                    {isConfirming && (
                      <div className="border-t pt-3 space-y-3">
                        <p className="text-sm font-medium">Confirmar recepción del bien</p>
                        <div className="grid gap-2">
                          <Label className="text-xs">Acta de recepción firmada (PDF, JPG o PNG)</Label>
                          <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setConfirmForm({ ...confirmForm, acta: e.target.files?.[0] ?? null })} />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-xs">Observaciones de la recepción</Label>
                          <Input placeholder="Estado del bien al recibirlo, etc." value={confirmForm.note} onChange={(e) => setConfirmForm({ ...confirmForm, note: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleConfirm(m.id)} disabled={saving}>
                            {saving ? "Guardando..." : "Confirmar"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setConfirmingId(null)}>Cancelar</Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CustodianChange({ from, to }: { from?: string; to?: string }) {
  if (!from && !to) return <>—</>;
  if (!to) return <span className="text-muted-foreground">{from}</span>;
  return (
    <span className="flex items-center gap-1 flex-wrap">
      <span className="text-muted-foreground line-through text-xs">{from ?? "ninguno"}</span>
      <ArrowRight className="w-3 h-3 shrink-0" />
      <span className="font-medium">{to}</span>
    </span>
  );
}

function LocationChange({ from, to }: { from?: string; to?: string }) {
  if (!from && !to) return <>—</>;
  if (!to) return <span className="text-muted-foreground">{from}</span>;
  return (
    <span className="flex items-center gap-1 flex-wrap">
      <span className="text-muted-foreground line-through text-xs">{from || "ninguna"}</span>
      <ArrowRight className="w-3 h-3 shrink-0" />
      <span className="font-medium">{to}</span>
    </span>
  );
}
