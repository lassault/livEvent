import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function ArtistDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/artist/login");
  }

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id, name, verified")
    .eq("email", user.email!)
    .single();

  if (!artist) {
    redirect("/artist/login");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: events } = await supabase
    .from("events")
    .select("event_id, name, date, localization")
    .eq("artist_id", artist.artist_id)
    .gte("date", today)
    .order("date", { ascending: true });

  const { data: pastEvents } = await supabase
    .from("events")
    .select("event_id, name, date")
    .eq("artist_id", artist.artist_id)
    .lt("date", today)
    .order("date", { ascending: false })
    .limit(5);

  const { data: notifications } = await supabase
    .from("notifications")
    .select("notification_id, event_id, title, created_at")
    .eq("artist_id", artist.artist_id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Panel de Artista</h1>
            <p className={styles.subtitle}>
              Bienvenido,{" "}
              <strong>{artist.name}</strong>
              {!artist.verified && (
                <span className={styles.pendingBadge}>
                  · Pendiente de verificación
                </span>
              )}
            </p>
          </div>
          <Link href="/api/artist/logout" className={styles.logoutBtn}>
            Cerrar sesión
          </Link>
        </div>

        <div className={styles.grid}>
          {/* Upcoming events */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Próximos eventos</h2>
              <Link href="/artist/events/create" className={styles.actionBtn}>
                + Crear evento
              </Link>
            </div>
            {events && events.length > 0 ? (
              <ul className={styles.list}>
                {events.map((event) => (
                  <li key={event.event_id} className={styles.item}>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{event.name}</span>
                      <span className={styles.itemMeta}>
                        📅 {new Date(event.date).toLocaleDateString("es-ES")} ·
                        📍 {event.localization}
                      </span>
                    </div>
                    <div className={styles.itemActions}>
                      <Link
                        href={`/artist/events/${event.event_id}/edit`}
                        className={styles.editBtn}
                      >
                        Editar
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No tienes eventos próximos.</p>
            )}
          </section>

          {/* Surveys & notifications */}
          <div>
            <section className={styles.section} style={{ marginBottom: "1rem" }}>
              <div className={styles.sectionHeader}>
                <h2>Encuestas</h2>
                <Link href="/artist/surveys" className={styles.actionBtn}>
                  Gestionar
                </Link>
              </div>
              <p className={styles.hint}>
                Crea encuestas para que los asistentes valoren tus eventos.
              </p>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Notificaciones</h2>
                <Link href="/artist/notifications" className={styles.actionBtn}>
                  Gestionar
                </Link>
              </div>
              {notifications && notifications.length > 0 ? (
                <ul className={styles.list}>
                  {notifications.map((n) => (
                    <li key={n.notification_id} className={styles.item}>
                      <span className={styles.itemName}>{n.title}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.empty}>No hay notificaciones.</p>
              )}
            </section>
          </div>
        </div>

        {pastEvents && pastEvents.length > 0 && (
          <section className={styles.section} style={{ marginTop: "1rem" }}>
            <h2 className={styles.sectionTitle}>Eventos pasados</h2>
            <ul className={styles.list}>
              {pastEvents.map((event) => (
                <li key={event.event_id} className={styles.item}>
                  <span className={styles.itemName}>{event.name}</span>
                  <span className={styles.itemMeta}>
                    {new Date(event.date).toLocaleDateString("es-ES")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
