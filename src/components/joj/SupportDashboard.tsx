import { useEffect, useState } from "react";
import { MapPin, Navigation, User, CheckCircle2, XCircle, UserPlus, Clock, Loader2 } from "lucide-react";
import { useJoj, statusLabels, isOnline, type Reservation, type ReservationStatus, type Profile } from "@/lib/jojStore";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<ReservationStatus, string> = {
  pending: "bg-joj-yellow/30 text-foreground",
  approved: "bg-joj-blue/15 text-joj-blue",
  in_progress: "bg-joj-emerald/15 text-joj-emerald",
  completed: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/15 text-destructive",
};

export function SupportDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [drivers, setDrivers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile: me } = useJoj();

  async function load() {
    const [{ data: r }, { data: p }] = await Promise.all([
      supabase.from("reservations").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    if (r) setReservations(r as Reservation[]);
    if (p) {
      const map: Record<string, Profile> = {};
      for (const pr of p as Profile[]) map[pr.id] = pr;
      setProfiles(map);
      setDrivers((p as Profile[]).filter((x) => x.role === "driver"));
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel(`support-feed`)
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function assign(id: string, driverId: string) {
    await supabase.from("reservations").update({ driver_id: driverId, status: "approved" }).eq("id", id);
  }
  async function approve(id: string) {
    await supabase.from("reservations").update({ status: "approved" }).eq("id", id);
  }
  async function reject(id: string) {
    await supabase.from("reservations").update({ status: "rejected" }).eq("id", id);
  }

  const pending = reservations.filter((b) => b.status === "pending");
  const active = reservations.filter((b) => b.status === "approved" || b.status === "in_progress");
  const closed = reservations.filter((b) => b.status === "completed" || b.status === "rejected");
  const availableDrivers = drivers.filter(isOnline);

  function Card({ b }: { b: Reservation }) {
    const userName = profiles[b.user_id]?.full_name ?? "—";
    const driverName = b.driver_id ? profiles[b.driver_id]?.full_name : null;
    return (
      <div className="border border-border rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <User className="h-4 w-4 text-joj-blue" /> {userName}
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{b.category}</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
        </div>
        <div className="text-sm space-y-1 mb-3">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-joj-blue" /> {b.pickup_site}</div>
          <div className="flex items-center gap-2"><Navigation className="h-4 w-4 text-joj-emerald" /> {b.destination_site}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {new Date(b.pickup_time).toLocaleString("fr-FR")}</div>
        </div>
        {driverName && (
          <div className="text-xs mb-3 px-2 py-1 rounded bg-joj-emerald/10 text-joj-emerald inline-block font-semibold">
            Chauffeur : {driverName}
          </div>
        )}
        {b.status === "pending" && (
          <div className="flex flex-wrap gap-2 items-center">
            <select
              defaultValue=""
              onChange={(e) => e.target.value && assign(b.id, e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-input bg-background text-sm flex-1 min-w-[180px]"
            >
              <option value="">— Assigner un chauffeur en ligne —</option>
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>{d.full_name}</option>
              ))}
            </select>
            <button onClick={() => approve(b.id)} className="px-3 py-1.5 rounded-lg bg-joj-blue text-white text-sm font-semibold flex items-center gap-1 hover:opacity-90">
              <CheckCircle2 className="h-4 w-4" /> Approuver
            </button>
            <button onClick={() => reject(b.id)} className="px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold flex items-center gap-1 hover:opacity-90">
              <XCircle className="h-4 w-4" /> Rejeter
            </button>
          </div>
        )}
      </div>
    );
  }

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-joj-blue" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="text-sm text-muted-foreground">Bienvenue, {me?.full_name} — espace support en temps réel.</div>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="joj-card p-4">
          <div className="text-xs text-muted-foreground font-semibold">En attente</div>
          <div className="text-3xl font-black text-joj-yellow">{pending.length}</div>
        </div>
        <div className="joj-card p-4">
          <div className="text-xs text-muted-foreground font-semibold">Actives</div>
          <div className="text-3xl font-black text-joj-blue">{active.length}</div>
        </div>
        <div className="joj-card p-4">
          <div className="text-xs text-muted-foreground font-semibold">Chauffeurs en ligne</div>
          <div className="text-3xl font-black text-joj-emerald">{availableDrivers.length}</div>
        </div>
      </div>

      <div className="joj-card p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><UserPlus className="h-5 w-5 text-joj-yellow" /> Demandes en attente</h2>
        {pending.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Aucune demande en attente.</p> : (
          <div className="grid md:grid-cols-2 gap-3">{pending.map((b) => <Card key={b.id} b={b} />)}</div>
        )}
      </div>

      <div className="joj-card p-5">
        <h2 className="font-bold text-lg mb-4">Courses actives</h2>
        {active.length === 0 ? <p className="text-sm text-muted-foreground text-center py-6">Aucune course active.</p> : (
          <div className="grid md:grid-cols-2 gap-3">{active.map((b) => <Card key={b.id} b={b} />)}</div>
        )}
      </div>

      {closed.length > 0 && (
        <div className="joj-card p-5">
          <h2 className="font-bold text-lg mb-4">Historique</h2>
          <div className="grid md:grid-cols-2 gap-3">{closed.slice(0, 6).map((b) => <Card key={b.id} b={b} />)}</div>
        </div>
      )}
    </div>
  );
}
