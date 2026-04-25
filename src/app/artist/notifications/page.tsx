import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NotificationsManager from "./NotificationsManager";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/artist/login");

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id, name")
    .eq("email", user.email!)
    .single();

  if (!artist) redirect("/artist/login");

  const { data: events } = await supabase
    .from("events")
    .select("event_id, name, date")
    .eq("artist_id", artist.artist_id)
    .order("date", { ascending: false });

  const { data: notifications } = await supabase
    .from("notifications")
    .select("notification_id, event_id, title, description, created_at")
    .eq("artist_id", artist.artist_id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <Link href="/artist/dashboard" style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: 500 }}>
            ← Panel
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Notificaciones</h1>
        </div>
        <NotificationsManager
          artistId={artist.artist_id}
          events={events ?? []}
          notifications={notifications ?? []}
        />
      </main>
    </>
  );
}
