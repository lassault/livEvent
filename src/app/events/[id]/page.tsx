import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";
import { DEMO_EVENTS, DEMO_ARTISTS } from "@/lib/demo-data";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export async function generateStaticParams() {
  if (!IS_DEMO) return [];
  return DEMO_EVENTS.map((e) => ({ id: String(e.event_id) }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) notFound();

  if (IS_DEMO) {
    const event = DEMO_EVENTS.find((e) => e.event_id === eventId);
    if (!event) notFound();
    const artist = DEMO_ARTISTS.find((a) => a.artist_id === event.artist_id);

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const [hours, minutes] = event.duration.split(":");
    const durationText = `${hours}h ${minutes}min`;

    return (
      <>
        <Navbar />
        <main className={styles.main}>
          <Link href="/" className={styles.back}>
            ← Volver a eventos
          </Link>
          <div className={styles.content}>
            <h1 className={styles.title}>{event.name}</h1>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📅</span>
                <span>{formattedDate}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>⏱</span>
                <span>Duración: {durationText}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>📍</span>
                <span>{event.localization}</span>
              </div>
              {event.tickets && (
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>🎟</span>
                  <a
                    href={event.tickets}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ticketLink}
                  >
                    Comprar entradas
                  </a>
                </div>
              )}
            </div>
            <p className={styles.description}>{event.description}</p>
            {artist && (
              <div className={styles.artistSection}>
                <h2>Artista</h2>
                <Link
                  href={`/artists/${artist.artist_id}`}
                  className={styles.artistCard}
                >
                  <span className={styles.artistName}>{artist.name}</span>
                </Link>
              </div>
            )}
          </div>
        </main>
      </>
    );
  }

  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select(
      "event_id, artist_id, name, description, image, date, duration, localization, tickets"
    )
    .eq("event_id", eventId)
    .single();

  if (!event) notFound();

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id, name, image")
    .eq("artist_id", event.artist_id)
    .single();

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [hours, minutes] = event.duration.split(":");
  const durationText = `${hours}h ${minutes}min`;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/" className={styles.back}>
          ← Volver a eventos
        </Link>

        {event.image && (
          <img src={event.image} alt={event.name} className={styles.hero} />
        )}

        <div className={styles.content}>
          <h1 className={styles.title}>{event.name}</h1>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📅</span>
              <span>{formattedDate}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>⏱</span>
              <span>Duración: {durationText}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>📍</span>
              <span>{event.localization}</span>
            </div>
            {event.tickets && (
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>🎟</span>
                <a
                  href={event.tickets}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ticketLink}
                >
                  Comprar entradas
                </a>
              </div>
            )}
          </div>

          <p className={styles.description}>{event.description}</p>

          {artist && (
            <div className={styles.artistSection}>
              <h2>Artista</h2>
              <Link
                href={`/artists/${artist.artist_id}`}
                className={styles.artistCard}
              >
                {artist.image && (
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className={styles.artistImage}
                  />
                )}
                <span className={styles.artistName}>{artist.name}</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
