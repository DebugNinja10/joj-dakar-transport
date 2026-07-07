import { useState } from "react";
import { Trophy, LogIn, UserPlus, Users, Car, Headphones, Loader2 } from "lucide-react";
import { useJoj, type Role, roleLabels } from "@/lib/jojStore";

// SECURITY: 'admin' is intentionally excluded from public signup.
// Admin role must be granted directly in the database.
const SIGNUP_ROLES: Role[] = ["user", "driver", "support"];
const roleIcons: Record<Exclude<Role, "admin">, React.ComponentType<{ className?: string }>> = {
  user: Users,
  driver: Car,
  support: Headphones,
};

export function AuthPage() {
  const { signIn, signUp } = useJoj();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setInfo(""); setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) setError(traduireErreur(error));
      } else {
        if (!name || !email || !password) { setError("Tous les champs sont requis."); return; }
        const { error } = await signUp({ email, password, full_name: name, role });
        if (error) setError(traduireErreur(error));
        else setInfo("Compte créé ! Vous pouvez maintenant vous connecter.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-3 joj-gradient px-5 py-2 rounded-full text-sm font-semibold">
            <Trophy className="h-5 w-5" />
            JOJ Dakar 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Smart Transport <br />
            <span className="bg-gradient-to-r from-joj-blue to-joj-emerald bg-clip-text text-transparent">
              Management Platform
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Plateforme intelligente de gestion du transport pour les Jeux Olympiques de la Jeunesse Dakar 2026.
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full bg-joj-blue/10 text-joj-blue text-xs font-semibold">Dakar</span>
            <span className="px-3 py-1 rounded-full bg-joj-emerald/10 text-joj-emerald text-xs font-semibold">Diamniadio</span>
            <span className="px-3 py-1 rounded-full bg-joj-yellow/30 text-foreground text-xs font-semibold">Saly</span>
          </div>
        </div>

        <div className="joj-card p-6 md:p-8">
          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setInfo(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition ${mode === "login" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
            >
              <LogIn className="h-4 w-4" /> Connexion
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); setInfo(""); }}
              className={`flex-1 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition ${mode === "register" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
            >
              <UserPlus className="h-4 w-4" /> Inscription
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Nom complet</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    placeholder="Ex: Mamadou Diallo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sélectionnez votre rôle</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SIGNUP_ROLES.map((r) => {
                      const Icon = roleIcons[r as Exclude<Role, "admin">];
                      const active = role === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition text-left ${active ? "border-joj-blue bg-joj-blue/5" : "border-border hover:border-joj-blue/40"}`}
                        >
                          <Icon className={`h-5 w-5 ${active ? "text-joj-blue" : "text-muted-foreground"}`} />
                          <span className="text-xs font-semibold leading-tight">{roleLabels[r]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="vous@joj.sn"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={6}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-joj-emerald">{info}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full joj-gradient py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function traduireErreur(msg: string): string {
  if (/invalid login/i.test(msg)) return "Identifiants invalides.";
  if (/already registered/i.test(msg)) return "Cet email est déjà utilisé.";
  if (/password/i.test(msg) && /6/.test(msg)) return "Le mot de passe doit faire au moins 6 caractères.";
  return msg;
}
