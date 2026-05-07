"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../../login/page.module.css";

interface Event {
  event_id: number;
  name: string;
  description: string;
  image: string | null;
  date: string;
  duration: string;
  localization: string;
  tickets: string | null;
}

export default function EditEventForm({ event }: { event: Event }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: event.name,
    description: event.description,
    image: event.image ?? "",
    date: event.date,
    duration: event.duration,
    localization: event.localization,
    tickets: event.tickets ?? "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      const res = await fetch(`/api/events/${event.event_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al actualizar");
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

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que quieres eliminar este evento?")) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/events?eventId=${event.event_id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        router.push("/artist/dashboard");
        router.refresh();
      }
    } catch {
      setError("Error al eliminar el evento.");
      setDeleting(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card} style={{ maxWidth: 540 }}>
        <h1 className={styles.title}>Editar Evento</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Nombre del evento *</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
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
            <Link
              href="/artist/dashboard"
              className={styles.btn}
              style={{
                background: "var(--text-secondary)",
                textAlign: "center",
                flex: 1,
              }}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className={styles.btn}
              disabled={loading}
              style={{ flex: 2 }}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: "transparent",
              border: "1.5px solid var(--error)",
              color: "var(--error)",
              borderRadius: 8,
              padding: "0.5rem 1rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              width: "100%",
            }}
          >
            {deleting ? "Eliminando..." : "Eliminar evento"}
          </button>
        </div>
      </div>
    </main>
  );
}
