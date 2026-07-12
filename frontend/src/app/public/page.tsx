"use client";

import Link from "next/link";
import { Package, Users, LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PublicHomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <LayoutDashboard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">Parque Informático GPMS</h1>
          <p className="text-xs text-muted-foreground">Consulta pública de inventario</p>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Consulta de Inventario</h2>
          <p className="text-muted-foreground mt-1">
            Accede al catálogo de activos informáticos y custodios registrados.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <Link href="/public/assets" className="group">
            <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Activos</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Listado de equipos e inventario registrado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/public/custodians" className="group">
            <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Custodios</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Responsables de los activos asignados.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
