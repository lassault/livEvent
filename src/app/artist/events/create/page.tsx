"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "../../login/page.module.css";

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    date: "",
    duration: "02:00:00",
    localization: "",
    tickets: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear el evento");
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
        <div className={styles.card} style={{ maxWidth: 540 }}>
          <h1 className={styles.title}>Crear Evento</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="name">Nombre del evento *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nombre del evento"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe el evento..."
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="date">Fecha *</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="duration">Duración (HH:MM:SS)</label>
              <input
                id="duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="02:00:00"
                pattern="\d{2}:\d{2}:\d{2}"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="localization">Localización *</label>
              <input
                id="localization"
                name="localization"
                value={form.localization}
                onChange={handleChange}
                required
                placeholder="Ciudad, Venue..."
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="image">URL de imagen</label>
              <input
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="tickets">URL de entradas</label>
              <input
                id="tickets"
                name="tickets"
                value={form.tickets}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/artist/dashboard" className={styles.btn} style={{ background: "var(--text-secondary)", textAlign: "center", flex: 1 }}>
                Cancelar
              </Link>
              <button
                type="submit"
                className={styles.btn}
                disabled={loading}
                style={{ flex: 2 }}
              >
                {loading ? "Creando..." : "Crear evento"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
