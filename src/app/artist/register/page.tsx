"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "../login/page.module.css";

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const GENDER_OPTIONS = [
  "Pop",
  "Rock",
  "Flamenco",
  "Jazz",
  "Electrónica",
  "Hip-Hop",
  "Reggaeton",
  "Clásica",
  "Folk",
  "Indie",
  "Otro",
];

export default function ArtistRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    description: "",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
    webpage: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (IS_DEMO) {
      setSuccess(
        "Demo: en la versión real, tu cuenta quedaría pendiente de verificación por un administrador."
      );
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al registrarse");
      } else {
        setSuccess(
          "Registro enviado. Tu cuenta será verificada por un administrador."
        );
        setTimeout(() => router.push("/artist/login"), 3000);
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
        <div className={styles.card} style={{ maxWidth: 540 }}>
          <h1 className={styles.title}>Registro de Artista</h1>
          <p className={styles.subtitle}>
            Crea tu perfil y promociona tus eventos
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Nombre artístico *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Tu nombre o nombre de grupo"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Contraseña *</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 8 caracteres"
                minLength={8}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="gender">Género musical *</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un género</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Cuéntanos sobre ti..."
                rows={3}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="https://instagram.com/tu_usuario"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="twitter">Twitter/X</label>
              <input
                id="twitter"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/tu_usuario"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="facebook">Facebook</label>
              <input
                id="facebook"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/tu_pagina"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="youtube">YouTube</label>
              <input
                id="youtube"
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/@tu_canal"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="webpage">Página web</label>
              <input
                id="webpage"
                name="webpage"
                value={form.webpage}
                onChange={handleChange}
                placeholder="https://tu-web.com"
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {success && (
              <p
                style={{
                  color: "var(--success)",
                  background: "#e8f5e9",
                  borderRadius: 8,
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.875rem",
                }}
              >
                {success}
              </p>
            )}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Enviando..." : "Solicitar registro"}
            </button>
          </form>

          <p className={styles.footer}>
            ¿Ya tienes cuenta? <Link href="/artist/login">Inicia sesión</Link>
          </p>
        </div>
      </main>
    </>
  );
}
