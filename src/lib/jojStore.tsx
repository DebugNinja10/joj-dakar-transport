import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type Role = "user" | "driver" | "support" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  online_status: boolean;
  last_seen: string;
  created_at: string;
}

export type ReservationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed";

export interface Reservation {
  id: string;
  user_id: string;
  pickup_site: string;
  destination_site: string;
  pickup_time: string;
  category: string;
  status: ReservationStatus;
  driver_id: string | null;
  vehicle_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type VehicleStatus = "available" | "busy" | "maintenance";

export interface Vehicle {
  id: string;
  plate_number: string;
  model: string;
  category: string;
  capacity: number;
  status: VehicleStatus;
  site: string;
}

interface Ctx {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (data: { email: string; password: string; full_name: string; role: Role }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const JojContext = createContext<Ctx | null>(null);

export function JojProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mark online on login, offline on logout. Gated on an authenticated session.
  async function setOnline(userId: string, online: boolean) {
    try {
      const { data: { session: live } } = await supabase.auth.getSession();
      if (!live?.user) return; // anonymous => skip (RLS would reject)
      const { error } = await supabase
        .from("profiles")
        .update({ online_status: online, last_seen: new Date().toISOString() })
        .eq("id", userId);
      if (error) console.warn("[joj] setOnline:", error.message);
    } catch (e) {
      console.warn("[joj] setOnline threw:", e);
    }
  }

  async function loadProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        console.warn("[joj] loadProfile:", error.message);
        setProfile(null);
        return;
      }
      setProfile((data as Profile) ?? null);
    } catch (e) {
      console.warn("[joj] loadProfile threw:", e);
      setProfile(null);
    }
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      setSession(sess);
      if (sess?.user) {
        setTimeout(() => {
          loadProfile(sess.user.id);
          if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
            setOnline(sess.user.id, true);
          }
        }, 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        if (data.session?.user) {
          loadProfile(data.session.user.id);
          setOnline(data.session.user.id, true);
        }
      })
      .catch((e) => console.warn("[joj] getSession failed:", e))
      .finally(() => setLoading(false));

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  // Heartbeat: keep online_status=true while the tab is alive
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    setOnline(uid, true);
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "hidden") setOnline(uid, true);
    }, 25_000);
    const onVis = () => {
      if (document.visibilityState === "visible") setOnline(uid, true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [session?.user?.id]);


  // Realtime: keep own profile in sync
  useEffect(() => {
    if (!session?.user) return;
    const ch = supabase
      .channel(`profile-${session.user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${session.user.id}` },
        (payload) => setProfile(payload.new as Profile),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [session?.user?.id]);

  const value: Ctx = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    async signUp({ email, password, full_name, role }) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name, role },
        },
      });
      return error ? { error: error.message } : {};
    },
    async signOut() {
      if (session?.user) await setOnline(session.user.id, false);
      await supabase.auth.signOut();
      setProfile(null);
    },
  };

  return <JojContext.Provider value={value}>{children}</JojContext.Provider>;
}

export function useJoj() {
  const ctx = useContext(JojContext);
  if (!ctx) throw new Error("useJoj must be used within JojProvider");
  return ctx;
}

export const roleLabels: Record<Role, string> = {
  user: "Utilisateur (Athlète/Officiel)",
  driver: "Automobiliste / Transporteur",
  support: "Service Clientèle / Support",
  admin: "Administrateur",
};

export const statusLabels: Record<ReservationStatus, string> = {
  pending: "En attente",
  approved: "Validé",
  rejected: "Rejeté",
  in_progress: "En course",
  completed: "Terminé",
};

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  available: "Disponible",
  busy: "En course",
  maintenance: "Maintenance",
};

// A profile is considered "in ligne" if flagged online OR seen in the last 90s.
export function isOnline(p: Pick<Profile, "online_status" | "last_seen">): boolean {
  if (p.online_status) return true;
  if (!p.last_seen) return false;
  const ageMs = Date.now() - new Date(p.last_seen).getTime();
  return ageMs >= 0 && ageMs < 90_000;
}

