"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../login/page.module.css";

interface Event {
  event_id: number;
  name: string;
  date: string;
}

interface Notification {
  notification_id: number;
  event_id: number;
  title: string;
  description: string | null;
  created_at: string;
}

interface Props {
  artistId: number;
  events: Event[];
  notifications: Notification[];
}

export default function NotificationsManager({
  events,
  notifications: initial,
}: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initial);
  const [form, setForm] = useState({
    event_id: "",
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: parseInt(form.event_id, 10),
          title: form.title,
          description: form.description || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear la notificación");
      } else {
        setForm({ event_id: "", title: "", description: "" });
        router.refresh();
      }
    } catch {
      setError("Error de red.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(notificationId: number) {
    if (!confirm("¿Eliminar esta notificación?")) return;
    const res = await fetch(
      `/api/notifications?notificationId=${notificationId}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== notificationId)
      );
    }
  }

  return (
    <div>
      <div
        style={{
          background: "var(--surface)",
          borderRadius: 12,
          padding: "1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
          Nueva notificación
        </h2>
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="event_id">Evento</label>
            <select
              id="event_id"
              name="event_id"
              value={form.event_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un evento</option>
              {events.map((ev) => (
                <option key={ev.event_id} value={ev.event_id}>
                  {ev.name} ({new Date(ev.date).toLocaleDateString("es-ES")})
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Título de la notificación"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Descripción opcional..."
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Enviando..." : "Crear notificación"}
          </button>
        </form>
      </div>

      <div
        style={{
          background: "var(--surface)",
          borderRadius: 12,
          padding: "1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
          Mis notificaciones ({notifications.length})
        </h2>
        {notifications.length > 0 ? (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {notifications.map((n) => {
              const ev = events.find((e) => e.event_id === n.event_id);
              return (
                <li
                  key={n.notification_id}
                  style={{
                    background: "var(--background)",
                    borderRadius: 8,
                    padding: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{n.title}</p>
                    {ev && (
                      <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                        Evento: {ev.name}
                      </p>
                    )}
                    {n.description && (
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {n.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(n.notification_id)}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--error)",
                      color: "var(--error)",
                      borderRadius: 6,
                      padding: "0.2rem 0.5rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    Eliminar
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            No hay notificaciones.
          </p>
        )}
      </div>
    </div>
  );
}
