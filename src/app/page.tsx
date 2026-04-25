import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type EventFilter = "past" | "today" | "upcoming";

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter: EventFilter =
    params.filter === "past"
      ? "past"
      : params.filter === "today"
        ? "today"
        : "upcoming";

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  let query = supabase
    .from("events")
    .select("event_id, name, description, image, date, duration, localization");

  if (filter === "past") {
    query = query.lt("date", today).order("date", { ascending: false });
  } else if (filter === "today") {
    query = query.eq("date", today).order("date", { ascending: true });
  } else {
    query = query.gt("date", today).order("date", { ascending: true });
  }

  const { data: events } = await query;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Eventos</h1>
          <div className={styles.filters}>
            <Link
              href="/?filter=past"
              className={filter === "past" ? styles.activeFilter : styles.filter}
            >
              Pasados
            </Link>
            <Link
              href="/?filter=today"
              className={
                filter === "today" ? styles.activeFilter : styles.filter
              }
            >
              Hoy
            </Link>
            <Link
              href="/?filter=upcoming"
              className={
                filter === "upcoming" ? styles.activeFilter : styles.filter
              }
            >
              Próximos
            </Link>
          </div>
        </div>

        {events && events.length > 0 ? (
          <ul className={styles.list}>
            {events.map((event) => (
              <li key={event.event_id} className={styles.card}>
                <Link href={`/events/${event.event_id}`}>
                  {event.image && (
                    <img
                      src={event.image}
                      alt={event.name}
                      className={styles.image}
                    />
                  )}
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{event.name}</h2>
                    <p className={styles.cardMeta}>
                      📅 {new Date(event.date).toLocaleDateString("es-ES")}
                    </p>
                    <p className={styles.cardMeta}>📍 {event.localization}</p>
                    <p className={styles.cardDesc}>{event.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No hay eventos {filter === "today" ? "hoy" : filter === "past" ? "pasados" : "próximos"}.</p>
        )}
      </main>
    </>
  );
}
