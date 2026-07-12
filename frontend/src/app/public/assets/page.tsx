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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.assets
      .getAll()
      .then((data) => setAssets(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Error al cargar activos"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assets.filter(
    (a) =>
      a.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.brand?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <p className="text-sm text-muted-foreground">Inventario de activos</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center gap-2 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o marca..."
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
                  <TableHead>Marca / Modelo</TableHead>
                  <TableHead>Custodio</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Valor Actual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-destructive">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No se encontraron activos.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono">{a.code || "—"}</TableCell>
                      <TableCell className="font-medium">{a.assetName}</TableCell>
                      <TableCell>
                        {[a.brand, a.model].filter(Boolean).join(" ") || "—"}
                      </TableCell>
                      <TableCell>{a.custodian?.fullName || "—"}</TableCell>
                      <TableCell>{a.location || "—"}</TableCell>
                      <TableCell>
                        {a.currentValue != null ? `$${a.currentValue.toFixed(2)}` : "—"}
                      </TableCell>
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
