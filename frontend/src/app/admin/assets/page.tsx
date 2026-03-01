"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Asset } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Pencil, Trash2, Plus, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function AssetsAdminPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.assets.getAll();
      if (Array.isArray(data)) {
        setAssets(data);
      } else {
        console.error("Data received is not an array:", data);
        setAssets([]);
      }
    } catch (err: any) {
      console.error("Error loading assets:", err);
      setError(err.message || "Error al cargar activos. Verifica que el servidor esté encendido.");
    } finally {
      setLoading(false);
    }
  }


  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este activo?")) {
      try {
        await api.assets.delete(id);
        loadAssets();
      } catch (error) {
        alert("Error al eliminar activo");
      }
    }
  }

  const filteredAssets = assets.filter(a => 
    a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administración de Activos</h1>
          <p className="text-muted-foreground text-sm">Control de inventario y equipos.</p>
        </div>
        <Link href="/admin/assets/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Activo
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar por nombre o código..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre del Activo</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Valor Actual</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Cargando...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : filteredAssets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">No hay activos registrados.</TableCell>
                </TableRow>
              ) : (
                filteredAssets.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono">{a.code || "---"}</TableCell>
                    <TableCell className="font-medium">{a.assetName}</TableCell>
                    <TableCell>{a.brand} {a.model}</TableCell>
                    <TableCell>{a.location}</TableCell>
                    <TableCell>${a.currentValue?.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/admin/assets/${a.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
