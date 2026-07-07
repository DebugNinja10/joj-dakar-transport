import { useEffect, useState } from "react";
import {
  MapPin, Navigation, Clock, Tag, Send, CheckCircle2, Loader2, XCircle, Map, Car,
} from "lucide-react";
import { useJoj, statusLabels, type Reservation, type ReservationStatus, type Profile } from "@/lib/jojStore";
import { supabase } from "@/integrations/supabase/client";

const statusColors: Record<ReservationStatus, string> = {
  pending: "bg-joj-yellow/30 text-foreground",
  approved: "bg-joj-blue/15 text-joj-blue",
  in_progress: "bg-joj-emerald/15 text-joj-emerald",
  completed: "bg-muted text-muted-foreground",
  rejected: "bg-destructive/15 text-destructive",
};

const statusIcons: Record<ReservationStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  approved: CheckCircle2,
  in_progress: Loader2,
  completed: CheckCircle2,
  rejected: XCircle,
};

const SITES = ["Village Olympique Saly", "Stade L.S. Senghor (Dakar)", "Arena Diamniadio", "Aéroport AIBD", "Centre-ville Dakar"];

export function UserDashboard() {
  const { user } = useJoj();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [drivers, setDrivers] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [pickup, setPickup] = useState(SITES[0]);
  const [destination, setDestination] = useState(SITES[1]);
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Athlète");

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setReservations((data ?? []) as Reservation[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    if (!user) return;
    const ch = supabase
      .channel(`my-reservations-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Fetch driver names for assigned reservations
  useEffect(() => {
    const ids = Array.from(new Set(reservations.map((r) => r.driver_id).filter(Boolean))) as string[];
    const missing = ids.filter((id) => !drivers[id]);
    if (missing.length === 0) return;
    supabase.from("profiles").select("*").in("id", missing).then(({ data }) => {
      if (!data) return;
      setDrivers((prev) => {
        const next = { ...prev };
        for (const p of data as Profile[]) next[p.id] = p;
        return next;
      });
    });
  }, [reservations, drivers]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !pickup || !destination || !time) return;
    setSubmitting(true); setError("");
    const { error } = await supabase.from("reservations").insert({
      user_id: user.id,
      pickup_site: pickup,
      destination_site: destination,
      pickup_time: new Date(time).toISOString(),
      category,
    });
    if (error) setError(error.message);
    else setTime("");
    setSubmitting(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="joj-card p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Send className="h-5 w-5 text-joj-blue" /> Commander un transport
        </h2>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1 mb-1.5"><MapPin className="h-3 w-3" /> Départ</label>
            <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background">
              {SITES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1 mb-1.5"><Navigation className="h-3 w-3" /> Destination</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background">
              {SITES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1 mb-1.5"><Clock className="h-3 w-3" /> Heure</label>
            <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-input bg-background" />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1 mb-1.5"><Tag className="h-3 w-3" /> Catégorie</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background">
              <option>Athlète</option>
              <option>Officiel</option>
              <option>Personnel accrédité</option>
              <option>Médical</option>
            </select>
          </div>
          {error && <p className="md:col-span-2 text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={submitting} className="md:col-span-2 joj-gradient py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Envoyer la demande
          </button>
        </form>
      </div>

      <div className="joj-card p-5">
        <h2 className="font-bold text-lg mb-4">Mes Réservations</h2>
        {loading ? (
          <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-joj-blue" /></div>
        ) : reservations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Aucune réservation pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {reservations.map((b) => {
              const Icon = statusIcons[b.status];
              const driverName = b.driver_id ? drivers[b.driver_id]?.full_name : null;
              return (
                <div key={b.id} className="border border-border rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm font-semibold flex-wrap">
                        <MapPin className="h-4 w-4 text-joj-blue shrink-0" />
                        <span className="truncate">{b.pickup_site}</span>
                        <span className="text-muted-foreground">→</span>
                        <Navigation className="h-4 w-4 text-joj-emerald shrink-0" />
                        <span className="truncate">{b.destination_site}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(b.pickup_time).toLocaleString("fr-FR")}</span>
                        <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {b.category}</span>
                        {driverName && <span className="flex items-center gap-1"><Car className="h-3 w-3" /> {driverName}</span>}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[b.status]}`}>
                      <Icon className={`h-3 w-3 ${b.status === "in_progress" ? "animate-spin" : ""}`} />
                      {statusLabels[b.status]}
                    </span>
                  </div>
                  {(b.status === "in_progress" || b.status === "approved") && (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-joj-blue/5 to-joj-emerald/5 border border-dashed border-joj-blue/30">
                      <div className="flex items-center gap-2 text-xs font-semibold text-joj-blue mb-2">
                        <Map className="h-4 w-4" /> Suivi du trajet
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-joj-blue" />
                        <div className="flex-1 h-1 bg-gradient-to-r from-joj-blue via-joj-emerald to-muted rounded-full relative overflow-hidden">
                          <div className={`absolute top-0 left-0 h-full bg-joj-emerald ${b.status === "in_progress" ? "w-2/3 animate-pulse" : "w-1/4"}`} />
                        </div>
                        <Car className="h-4 w-4 text-joj-emerald" />
                        <div className="flex-1 h-1 bg-muted rounded-full" />
                        <div className="h-3 w-3 rounded-full bg-joj-yellow" />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium">
                        <span>{b.pickup_site}</span>
                        <span>{b.destination_site}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
