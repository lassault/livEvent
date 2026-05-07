import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";
import { DEMO_ARTISTS } from "@/lib/demo-data";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default async function ArtistsPage() {
  const artists = IS_DEMO
    ? DEMO_ARTISTS
    : await (async () => {
        const supabase = await createClient();
        const { data } = await supabase
          .from("artists")
          .select("artist_id, name, description, image")
          .eq("verified", true)
          .order("name", { ascending: true });
        return data ?? [];
      })();

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.heading}>Artistas</h1>

        {artists && artists.length > 0 ? (
          <ul className={styles.grid}>
            {artists.map((artist) => (
              <li key={artist.artist_id} className={styles.card}>
                <Link href={`/artists/${artist.artist_id}`}>
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
                  <div className={styles.cardBody}>
                    <h2 className={styles.name}>{artist.name}</h2>
                    {artist.description && (
                      <p className={styles.description}>{artist.description}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No hay artistas registrados.</p>
        )}
      </main>
    </>
  );
}
