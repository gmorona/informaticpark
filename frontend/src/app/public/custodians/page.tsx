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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicCustodiansPage() {
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.custodians
      .getAll()
      .then((data) => setCustodians(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Error al cargar custodios"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = custodians.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.unit?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/public" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Parque Informático GPMS</h1>
            <p className="text-sm text-muted-foreground">Custodios registrados</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center gap-2 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, cédula o unidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Unidad / Dependencia</TableHead>
                  <TableHead>Activos asignados</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No se encontraron custodios.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.fullName}</TableCell>
                      <TableCell className="font-mono">{c.identifier}</TableCell>
                      <TableCell>{c.unit || "—"}</TableCell>
                      <TableCell>{c.assets?.length ?? "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
