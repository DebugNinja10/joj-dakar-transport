import { useEffect, useMemo, useState } from "react";
import {
  Car, Activity, AlertTriangle, MapPin, Plus, Trash2, Users, TrendingUp, Radio, Loader2,
  Headphones, Shield,
} from "lucide-react";
import {
  useJoj, statusLabels, vehicleStatusLabels, isOnline,
  type Vehicle, type VehicleStatus, type Reservation, type Profile, type Role,
} from "@/lib/jojStore";

import { supabase } from "@/integrations/supabase/client";

const SITES = ["Dakar", "Diamniadio", "Saly"];

const roleColor: Record<Role, string> = {
  user: "bg-joj-blue/10 text-joj-blue",
  driver: "bg-joj-emerald/10 text-joj-emerald",
  support: "bg-joj-yellow/30 text-foreground",
  admin: "bg-joj-red/10 text-joj-red",
};

export function AdminDashboard() {
  const { profile: me } = useJoj();
  const [tab, setTab] = useState<"overview" | "sessions" | "fleet" | "sites">("overview");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [{ data: p }, { data: r }, { data: v }] = await Promise.all([
      supabase.from("profiles").select("*").order("full_name"),
      supabase.from("reservations").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("*").order("plate_number"),
    ]);
    if (p) setProfiles(p as Profile[]);
    if (r) setReservations(r as Reservation[]);
    if (v) setVehicles(v as Vehicle[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const ch = supabase
      .channel("admin-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "vehicles" }, () => load())
      .subscribe();
    // Auto-refresh every 30s so stale presence drops without manual reload.
    const tick = window.setInterval(load, 30_000);
    return () => { supabase.removeChannel(ch); window.clearInterval(tick); };
  }, []);


  const stats = useMemo(() => ({
    vehicles: vehicles.length,
    activeBookings: reservations.filter((b) => b.status === "approved" || b.status === "in_progress").length,
    pending: reservations.filter((b) => b.status === "pending").length,
    completed: reservations.filter((b) => b.status === "completed").length,
    alerts: vehicles.filter((v) => v.status === "maintenance").length,
    online: profiles.filter(isOnline).length,
  }), [vehicles, reservations, profiles]);

  const online = profiles.filter(isOnline);
  const byRole = (role: Role) => online.filter((p) => p.role === role);


  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-joj-blue" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="text-sm text-muted-foreground">Bienvenue, {me?.full_name}</div>
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit flex-wrap">
        {[
          { id: "overview", label: "Vue d'ensemble" },
          { id: "sessions", label: "Sessions temps réel" },
          { id: "fleet", label: "Flotte" },
          { id: "sites", label: "Sites olympiques" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${tab === t.id ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Car} label="Total véhicules" value={stats.vehicles} color="joj-blue" />
            <StatCard icon={Activity} label="Réservations actives" value={stats.activeBookings} color="joj-emerald" />
            <StatCard icon={AlertTriangle} label="Maintenance" value={stats.alerts} color="joj-red" />
            <StatCard icon={Radio} label="Utilisateurs en ligne" value={stats.online} color="joj-yellow" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="joj-card p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-joj-blue" /> Activité récente</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {reservations.slice(0, 10).map((b) => {
                  const userName = profiles.find((p) => p.id === b.user_id)?.full_name ?? "—";
                  return (
                    <div key={b.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0 gap-2">
                      <span className="truncate">{userName} · {b.pickup_site} → {b.destination_site}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted shrink-0">{statusLabels[b.status]}</span>
                    </div>
                  );
                })}
                {reservations.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Aucune activité.</p>}
              </div>
            </div>
            <div className="joj-card p-5">
              <h3 className="font-bold mb-4">État des véhicules</h3>
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                    <span className="font-mono">{v.plate_number} · {v.model}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.status === "available" ? "bg-joj-emerald/15 text-joj-emerald" : v.status === "busy" ? "bg-joj-blue/15 text-joj-blue" : "bg-joj-yellow/30"}`}>
                      {vehicleStatusLabels[v.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "sessions" && (
        <div className="joj-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="h-5 w-5 text-joj-emerald animate-pulse" />
            <h3 className="font-bold">Suivi des sessions en temps réel</h3>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-joj-emerald/10 text-joj-emerald font-semibold">
              {online.length} en ligne
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <OnlineGroup icon={Users} title="Utilisateurs en ligne" people={byRole("user")} accent="joj-blue" />
            <OnlineGroup icon={Car} title="Automobilistes en ligne" people={byRole("driver")} accent="joj-emerald" />
            <OnlineGroup icon={Headphones} title="Personnels Support en ligne" people={byRole("support")} accent="joj-yellow" />
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-bold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-joj-red" /> Administrateurs en ligne</h4>
            <OnlineList people={byRole("admin")} />
          </div>
        </div>
      )}

      {tab === "fleet" && (
        <FleetTab vehicles={vehicles} onReload={load} />
      )}

      {tab === "sites" && (
        <div className="joj-card p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><MapPin className="h-4 w-4 text-joj-blue" /> Sites olympiques</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {SITES.map((site) => {
              const list = vehicles.filter((v) => v.site === site);
              return (
                <div key={site} className="border border-border rounded-xl p-4 bg-gradient-to-br from-joj-blue/5 to-joj-emerald/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-lg joj-gradient grid place-items-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold">{site}</div>
                      <div className="text-xs text-muted-foreground">Site olympique</div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-card rounded-lg p-2"><div className="text-muted-foreground">Véhicules</div><div className="font-bold text-lg">{list.length}</div></div>
                    <div className="bg-card rounded-lg p-2"><div className="text-muted-foreground">Disponibles</div><div className="font-bold text-lg text-joj-emerald">{list.filter((v) => v.status === "available").length}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const accentText: Record<string, string> = {
  "joj-blue": "text-joj-blue",
  "joj-emerald": "text-joj-emerald",
  "joj-yellow": "text-joj-yellow",
  "joj-red": "text-joj-red",
};

function OnlineGroup({ icon: Icon, title, people, accent }: { icon: React.ComponentType<{ className?: string }>; title: string; people: Profile[]; accent: string }) {
  return (
    <div className="border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`h-4 w-4 ${accentText[accent] ?? "text-joj-blue"}`} />
        <h4 className="font-bold text-sm">{title}</h4>
        <span className="ml-auto text-xs font-bold">{people.length}</span>
      </div>
      <OnlineList people={people} />
    </div>
  );
}

function OnlineList({ people }: { people: Profile[] }) {
  if (people.length === 0) return <p className="text-xs text-muted-foreground italic">Personne en ligne.</p>;
  return (
    <ul className="space-y-1.5">
      {people.map((p) => (
        <li key={p.id} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-joj-emerald animate-pulse" />
          <span className="truncate flex-1">{p.full_name}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${roleColor[p.role]}`}>
            {p.role}
          </span>
        </li>
      ))}
    </ul>
  );
}

const colorMap: Record<string, { bg: string; text: string }> = {
  "joj-blue": { bg: "bg-joj-blue/10", text: "text-joj-blue" },
  "joj-emerald": { bg: "bg-joj-emerald/10", text: "text-joj-emerald" },
  "joj-red": { bg: "bg-joj-red/10", text: "text-joj-red" },
  "joj-yellow": { bg: "bg-joj-yellow/30", text: "text-foreground" },
};

function StatCard({ icon: Icon, label, value, color }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; color: string }) {
  const c = colorMap[color] ?? colorMap["joj-blue"];
  return (
    <div className="joj-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground font-semibold uppercase">{label}</div>
          <div className="text-3xl font-black mt-1">{value}</div>
        </div>
        <div className={`h-12 w-12 rounded-xl grid place-items-center ${c.bg}`}>
          <Icon className={`h-6 w-6 ${c.text}`} />
        </div>
      </div>
    </div>
  );
}

function FleetTab({ vehicles, onReload }: { vehicles: Vehicle[]; onReload: () => void }) {
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("standard");
  const [capacity, setCapacity] = useState(9);
  const [site, setSite] = useState(SITES[0]);
  const [err, setErr] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!plate || !model) return;
    const { error } = await supabase.from("vehicles").insert({
      plate_number: plate, model, category, capacity, site, status: "available",
    });
    if (error) { setErr(error.message); return; }
    setPlate(""); setModel(""); setCapacity(9); setErr("");
    onReload();
  }

  async function update(id: string, status: VehicleStatus) {
    await supabase.from("vehicles").update({ status }).eq("id", id);
  }
  async function remove(id: string) {
    await supabase.from("vehicles").delete().eq("id", id);
  }

  return (
    <>
      <div className="joj-card p-5">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Plus className="h-4 w-4 text-joj-blue" /> Ajouter un véhicule</h3>
        <form onSubmit={add} className="grid md:grid-cols-6 gap-3">
          <input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Immatriculation" className="px-3 py-2 rounded-lg border border-input bg-background" />
          <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Modèle" className="px-3 py-2 rounded-lg border border-input bg-background" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Catégorie" className="px-3 py-2 rounded-lg border border-input bg-background" />
          <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(+e.target.value)} placeholder="Capacité" className="px-3 py-2 rounded-lg border border-input bg-background" />
          <select value={site} onChange={(e) => setSite(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-background">
            {SITES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="joj-gradient rounded-lg font-semibold py-2">Ajouter</button>
          {err && <p className="md:col-span-6 text-sm text-destructive">{err}</p>}
        </form>
      </div>

      <div className="joj-card p-5">
        <h3 className="font-bold mb-4">Flotte ({vehicles.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b">
                <th className="py-2 pr-4">Immat.</th>
                <th className="py-2 pr-4">Modèle</th>
                <th className="py-2 pr-4">Catégorie</th>
                <th className="py-2 pr-4">Cap.</th>
                <th className="py-2 pr-4">Site</th>
                <th className="py-2 pr-4">Statut</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-mono font-semibold">{v.plate_number}</td>
                  <td className="py-2 pr-4">{v.model}</td>
                  <td className="py-2 pr-4">{v.category}</td>
                  <td className="py-2 pr-4">{v.capacity}</td>
                  <td className="py-2 pr-4">{v.site}</td>
                  <td className="py-2 pr-4">
                    <select value={v.status} onChange={(e) => update(v.id, e.target.value as VehicleStatus)} className="px-2 py-1 rounded border border-input bg-background text-xs">
                      <option value="available">{vehicleStatusLabels.available}</option>
                      <option value="busy">{vehicleStatusLabels.busy}</option>
                      <option value="maintenance">{vehicleStatusLabels.maintenance}</option>
                    </select>
                  </td>
                  <td className="py-2 text-right">
                    <button onClick={() => remove(v.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
