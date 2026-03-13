import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Building2, Package } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">Panel de Administración Parque informatico</h1>
        <p className="text-muted-foreground text-lg">
          Gestiona usuarios, custodios y activos del sistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/admin/users">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <Users className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>
                Administrar cuentas de usuario, roles y estados.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/custodians">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <Building2 className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Custodios</CardTitle>
              <CardDescription>
                Gestionar responsables y unidades organizativas.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/assets">
          <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
            <CardHeader>
              <Package className="w-10 h-10 mb-2 text-primary" />
              <CardTitle>Activos</CardTitle>
              <CardDescription>
                Control total del inventario de activos y equipos.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

