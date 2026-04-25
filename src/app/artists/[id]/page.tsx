import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArtistDetailPage({ params }: PageProps) {
  const { id } = await params;
  const artistId = parseInt(id, 10);

  if (isNaN(artistId)) notFound();

  const supabase = await createClient();

  const { data: artist } = await supabase
    .from("artists")
    .select(
      "artist_id, name, gender, description, image, twitter, facebook, instagram, youtube, webpage"
    )
    .eq("artist_id", artistId)
    .eq("verified", true)
    .single();

  if (!artist) notFound();

  const today = new Date().toISOString().split("T")[0];
  const { data: events } = await supabase
    .from("events")
    .select("event_id, name, description, image, date, duration, localization")
    .eq("artist_id", artistId)
    .gt("date", today)
    .order("date", { ascending: true });

  const socials = [
    { key: "twitter", label: "Twitter/X", icon: "🐦", url: artist.twitter },
    {
      key: "facebook",
      label: "Facebook",
      icon: "📘",
      url: artist.facebook,
    },
    {
      key: "instagram",
      label: "Instagram",
      icon: "📸",
      url: artist.instagram,
    },
    { key: "youtube", label: "YouTube", icon: "▶️", url: artist.youtube },
    { key: "webpage", label: "Web", icon: "🌐", url: artist.webpage },
  ].filter((s) => s.url);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/artists" className={styles.back}>
          ← Volver a artistas
        </Link>

        <div className={styles.profile}>
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className={styles.avatar}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {artist.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.info}>
            <h1 className={styles.name}>{artist.name}</h1>
            <p className={styles.gender}>{artist.gender}</p>
            {artist.description && (
              <p className={styles.description}>{artist.description}</p>
            )}
            {socials.length > 0 && (
              <div className={styles.socials}>
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title={s.label}
                  >
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className={styles.events}>
          <h2>Próximos eventos</h2>
          {events && events.length > 0 ? (
            <ul className={styles.eventList}>
              {events.map((event) => (
                <li key={event.event_id} className={styles.eventCard}>
                  <Link href={`/events/${event.event_id}`}>
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.name}
                        className={styles.eventImage}
                      />
                    )}
                    <div className={styles.eventBody}>
                      <h3 className={styles.eventName}>{event.name}</h3>
                      <p className={styles.eventMeta}>
                        📅{" "}
                        {new Date(event.date).toLocaleDateString("es-ES")} · 📍{" "}
                        {event.localization}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>No hay próximos eventos.</p>
          )}
        </section>
      </main>
    </>
  );
}
