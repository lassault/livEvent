"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./page.module.css";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function ArtistLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(IS_DEMO ? "carmen@demo.livevent.es" : "");
  const [password, setPassword] = useState(IS_DEMO ? "••••••••" : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (IS_DEMO) {
      router.push("/artist/dashboard");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/artist/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al iniciar sesión");
      } else {
        router.push("/artist/dashboard");
        router.refresh();
      }
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Acceso Artista</h1>
          <p className={styles.subtitle}>
            {IS_DEMO
              ? "Demo: haz clic en «Iniciar sesión» para explorar el panel de artista"
              : "Inicia sesión para gestionar tus eventos"}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                readOnly={IS_DEMO}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                readOnly={IS_DEMO}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Entrando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className={styles.footer}>
            ¿No tienes cuenta?{" "}
            <Link href="/artist/register">Regístrate aquí</Link>
          </p>
        </div>
      </main>
    </>
  );
}
