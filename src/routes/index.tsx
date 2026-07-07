import { createFileRoute } from "@tanstack/react-router";
import { JojProvider, useJoj } from "@/lib/jojStore";
import { AuthPage } from "@/components/joj/AuthPage";
import { AppShell } from "@/components/joj/AppShell";
import { UserDashboard } from "@/components/joj/UserDashboard";
import { DriverDashboard } from "@/components/joj/DriverDashboard";
import { SupportDashboard } from "@/components/joj/SupportDashboard";
import { AdminDashboard } from "@/components/joj/AdminDashboard";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOJ Dakar 2026 — Smart Transport Management Platform" },
      { name: "description", content: "Plateforme intelligente de gestion du transport pour les Jeux Olympiques de la Jeunesse Dakar 2026." },
      { property: "og:title", content: "JOJ Dakar 2026 — Smart Transport Platform" },
      { property: "og:description", content: "Gestion intelligente du transport pour les JOJ Dakar 2026." },
    ],
  }),
  component: () => (
    <JojProvider>
      <Index />
    </JojProvider>
  ),
});

function Index() {
  const { user, profile, loading } = useJoj();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-joj-blue" />
      </div>
    );
  }
  if (!user) return <AuthPage />;
  if (!profile) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-joj-blue" />
      </div>
    );
  }
  return (
    <AppShell>
      {profile.role === "user" && <UserDashboard />}
      {profile.role === "driver" && <DriverDashboard />}
      {profile.role === "support" && <SupportDashboard />}
      {profile.role === "admin" && <AdminDashboard />}
    </AppShell>
  );
}
