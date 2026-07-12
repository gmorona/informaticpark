"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface LocationFormProps {
  locationId?: number;
}

export function LocationForm({ locationId }: LocationFormProps) {
  const router = useRouter();
  const isEdit = !!locationId;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    canton: "",
    parroquia: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    if (!isEdit) { setLoading(false); return; }
    api.locations.getById(locationId!)
      .then((loc) => {
        setFormData({
          canton: loc.canton ?? "",
          parroquia: loc.parroquia ?? "",
          lat: loc.lat != null ? String(loc.lat) : "",
          lng: loc.lng != null ? String(loc.lng) : "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        canton: formData.canton || undefined,
        parroquia: formData.parroquia || undefined,
        lat: formData.lat !== "" ? parseFloat(formData.lat) : undefined,
        lng: formData.lng !== "" ? parseFloat(formData.lng) : undefined,
      };
      if (isEdit) {
        await api.locations.update(locationId!, payload);
      } else {
        await api.locations.create(payload);
      }
      router.push("/admin/locations");
      router.refresh();
    } catch (error: any) {
      alert(error?.message || "Error al guardar ubicación");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/locations">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {isEdit ? "Editar Ubicación" : "Nueva Ubicación"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="canton">Cantón</Label>
                <Input
                  id="canton"
                  value={formData.canton}
                  onChange={(e) => setFormData({ ...formData, canton: e.target.value })}
                  placeholder="Ej. Quito"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parroquia">Parroquia</Label>
                <Input
                  id="parroquia"
                  value={formData.parroquia}
                  onChange={(e) => setFormData({ ...formData, parroquia: e.target.value })}
                  placeholder="Ej. Iñaquito"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lat">Latitud</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  placeholder="Ej. -0.1807"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lng">Longitud</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  placeholder="Ej. -78.4678"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar Ubicación"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
