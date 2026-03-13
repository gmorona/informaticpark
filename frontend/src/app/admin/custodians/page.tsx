"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Custodian } from "@/lib/types";
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
import { Building2, Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustodiansAdminPage() {
  const router = useRouter();
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustodians();
  }, []);

  async function loadCustodians() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.custodians.getAll();
      if (Array.isArray(data)) {
        setCustodians(data);
      } else {
        console.error("Data received is not an array:", data);
        setCustodians([]);
      }
    } catch (err: any) {
      console.error("Error loading custodians:", err);
      setError(err.message || "Error al cargar custodios. Verifica que el servidor esté encendido.");
    } finally {
      setLoading(false);
    }
  }



  async function handleDelete(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este custodio?")) {
      try {
        await api.custodians.delete(id);
        loadCustodians();
      } catch (error) {
        alert("Error al eliminar custodio");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Administración de Custodios</h1>
          <p className="text-muted-foreground text-sm">Gestiona los responsables de los activos.</p>
        </div>
        <Link href="/admin/custodians/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Custodio
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre Completo</TableHead>
                <TableHead>Identificador</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">Cargando...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-destructive">
                    {error}
                  </TableCell>
                </TableRow>
              ) : custodians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">No hay custodios registrados.</TableCell>
                </TableRow>
              ) : (
                custodians.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/admin/custodians/${c.id}/assets`)}
                  >
                    <TableCell className="font-medium">{c.fullName}</TableCell>
                    <TableCell>{c.identifier}</TableCell>
                    <TableCell>{c.unit || "N/A"}</TableCell>
                    <TableCell className="text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/custodians/${c.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
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
