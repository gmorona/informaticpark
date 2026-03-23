"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, LayoutDashboard, Clock } from "lucide-react";
import { useEffect, useState } from "react";

function getTokenExpiry(): number | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const expiry = getTokenExpiry();
    if (!expiry) return;

    const tick = () => {
      const secs = expiry - Math.floor(Date.now() / 1000);
      if (secs <= 0) {
        logout();
      } else {
        setRemaining(secs);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [user, logout]);

  if (!user) return null;

  const isExpiringSoon = remaining !== null && remaining <= 300;

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <span>Parque Informatico</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
            <UserIcon className="w-4 h-4" />
            <span>{user.name} ({user.role})</span>
            {remaining !== null && (
              <span className={`flex items-center gap-1 ml-2 font-mono ${isExpiringSoon ? "text-destructive" : "text-muted-foreground"}`}>
                <Clock className="w-3 h-3" />
                {formatCountdown(remaining)}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </nav>
  );
}
