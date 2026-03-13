"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Asset, Custodian } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("@/components/location-picker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="h-[320px] rounded-md border border-input flex items-center justify-center text-muted-foreground text-sm">Cargando mapa...</div> }
);

interface AssetFormProps {
  assetId?: number;
}

export function AssetForm({ assetId }: AssetFormProps) {
  const router = useRouter();
  const isEdit = !!assetId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [formData, setFormData] = useState({
    code: "",
    previousCode: "",
    assetName: "",
    brand: "",
    model: "",
    serialNumber: "",
    location: "",
    physicalLocation: "",
    accountCode: "",
    initialValue: 0,
    currentValue: 0,
    note: "",
    custodianId: "",
  });
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadCustodians();
    if (isEdit) {
      loadAsset();
    }
  }, [assetId]);

  async function loadCustodians() {
    try {
      const data = await api.custodians.getAll();
      setCustodians(data);
    } catch (error) {
      console.error("Error loading custodians:", error);
    }
  }

  async function loadAsset() {
    try {
      const asset = await api.assets.getById(assetId!);
      setFormData({
        code: asset.code || "",
        previousCode: asset.previousCode || "",
        assetName: asset.assetName,
        brand: asset.brand || "",
        model: asset.model || "",
        serialNumber: asset.serialNumber || "",
        location: asset.location || "",
        physicalLocation: asset.physicalLocation || "",
        accountCode: asset.accountCode || "",
        initialValue: asset.initialValue || 0,
        currentValue: asset.currentValue || 0,
        note: asset.note || "",
        custodianId: asset.custodianId?.toString() || "",
      });
      if (asset.coordinates) {
        const [lat, lng] = asset.coordinates.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng)) setCoordinates({ lat, lng });
      }
    } catch (error) {
      console.error("Error loading asset:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...formData,
        custodianId: formData.custodianId ? parseInt(formData.custodianId) : null,
        initialValue: parseFloat(formData.initialValue.toString()),
        currentValue: parseFloat(formData.currentValue.toString()),
        coordinates: coordinates ? `${coordinates.lat},${coordinates.lng}` : null,
      };
      if (isEdit) {
        await api.assets.update(assetId!, data);
      } else {
        await api.assets.create(data);
      }
      router.push("/admin/assets");
      router.refresh();
    } catch (error) {
      alert("Error al guardar activo");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/assets">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Editar Activo" : "Nuevo Activo"}
        </h1>
      </div>

      <Card>
        
        <CardHeader>
          <CardTitle>Información del Activo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label>Coordenadas de Ubicación</Label>
              <LocationPicker value={coordinates} onChange={setCoordinates} />
              {coordinates && (
                <input type="hidden" name="coordinates" value={`${coordinates.lat},${coordinates.lng}`} />
              )}
        </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="assetName">Nombre del Activo</Label>
                <Input
                  id="assetName"
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Código de Activo</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Modelo</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">Número de Serie</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="custodianId">Custodio Responsable</Label>
                <select
                  id="custodianId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.custodianId}
                  onChange={(e) => setFormData({ ...formData, custodianId: e.target.value })}
                >
                  <option value="">Seleccionar Custodio</option>
                  {custodians.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.identifier})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="initialValue">Valor Inicial</Label>
                <Input
                  id="initialValue"
                  type="number"
                  step="0.01"
                  value={formData.initialValue}
                  onChange={(e) => setFormData({ ...formData, initialValue: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currentValue">Valor Actual</Label>
                <Input
                  id="currentValue"
                  type="number"
                  step="0.01"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Notas / Observaciones</Label>
              <textarea
                id="note"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
            

            <Button type="submit" className="w-full" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Activo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
