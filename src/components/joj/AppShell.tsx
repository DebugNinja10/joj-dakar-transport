import { Trophy, LogOut } from "lucide-react";
import { useJoj, roleLabels } from "@/lib/jojStore";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, user, signOut } = useJoj();
  if (!profile || !user) return null;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex min-w-0 items-center gap-3 flex-1">
            <div className="h-10 w-10 shrink-0 rounded-xl joj-gradient grid place-items-center">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm sm:text-base truncate">
                Bonjour, {profile.full_name}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                JOJ Dakar 2026 · {roleLabels[profile.role]}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-joj-emerald/10 text-joj-emerald text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-joj-emerald animate-pulse" />
              En ligne
            </span>
            <span className="text-[10px] text-muted-foreground hidden md:block truncate max-w-[160px]">
              {user.email}
            </span>
            <button onClick={signOut} className="p-2 rounded-lg hover:bg-muted" aria-label="Déconnexion">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
