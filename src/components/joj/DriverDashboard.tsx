import { useEffect, useState } from "react";
import { MapPin, Navigation, User, CheckCircle2, Loader2, Clock } from "lucide-react";
import { useJoj, statusLabels, type Reservation, type Profile } from "@/lib/jojStore";
import { supabase } from "@/integrations/supabase/client";

export function DriverDashboard() {
  const { user, profile } = useJoj();
  const [missions, setMissions] = useState<Reservation[]>([]);
  const [riders, setRiders] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("driver_id", user.id)
      .order("pickup_time", { ascending: true });
    if (error) setError(error.message);
    else setMissions((data ?? []) as Reservation[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase
      .channel(`driver-missions-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations", filter: `driver_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const ids = Array.from(new Set(missions.map((m) => m.user_id)));
    const missing = ids.filter((id) => !riders[id]);
    if (missing.length === 0) return;
    supabase.from("profiles").select("*").in("id", missing).then(({ data }) => {
      if (!data) return;
      setRiders((prev) => {
        const next = { ...prev };
        for (const p of data as Profile[]) next[p.id] = p;
        return next;
      });
    });
  }, [missions, riders]);

  async function start(m: Reservation) {
    await supabase.from("reservations").update({ status: "in_progress" }).eq("id", m.id);
    if (m.vehicle_id) await supabase.from("vehicles").update({ status: "busy" }).eq("id", m.vehicle_id);
  }

  async function complete(m: Reservation) {
    await supabase.from("reservations").update({ status: "completed" }).eq("id", m.id);
    if (m.vehicle_id) await supabase.from("vehicles").update({ status: "available" }).eq("id", m.vehicle_id);
  }

  const active = missions.filter((m) => m.status !== "completed" && m.status !== "rejected");
  const history = missions.filter((m) => m.status === "completed");

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="joj-card p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-bold text-lg">Bonjour, {profile?.full_name}</h2>
            <p className="text-sm text-muted-foreground">Tableau de bord chauffeur</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-joj-emerald text-white flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> En ligne
          </span>
        </div>
      </div>

      <div className="joj-card p-5">
        <h2 className="font-bold text-lg mb-4">Mes Missions ({active.length})</h2>
        {loading ? (
          <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-joj-blue" /></div>
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : active.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucune mission assignée pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {active.map((m) => (
              <div key={m.id} className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm font-semibold mb-2 flex-wrap">
                  <User className="h-4 w-4 text-joj-blue" /> {riders[m.user_id]?.full_name ?? "Passager"}
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted">{m.category}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-joj-blue/10 text-joj-blue font-semibold">
                    {statusLabels[m.status]}
                  </span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-joj-blue" /> {m.pickup_site}</div>
                  <div className="flex items-center gap-2"><Navigation className="h-4 w-4 text-joj-emerald" /> {m.destination_site}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {new Date(m.pickup_time).toLocaleString("fr-FR")}</div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {m.status === "approved" && (
                    <button onClick={() => start(m)} className="flex-1 bg-joj-blue text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90">
                      Démarrer la course
                    </button>
                  )}
                  {m.status === "in_progress" && (
                    <button onClick={() => complete(m)} className="flex-1 bg-joj-emerald text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Terminer la course
                    </button>
                  )}
                  {m.status === "pending" && (
                    <span className="text-xs text-muted-foreground italic">En attente de validation par le support…</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="joj-card p-5">
          <h2 className="font-bold text-lg mb-4">Courses terminées ({history.length})</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                <span className="truncate">{riders[m.user_id]?.full_name ?? "Passager"} · {m.pickup_site} → {m.destination_site}</span>
                <CheckCircle2 className="h-4 w-4 text-joj-emerald shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
