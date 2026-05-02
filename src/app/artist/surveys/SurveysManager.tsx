"use client";

import { useState } from "react";
import styles from "../login/page.module.css";

interface Event {
  event_id: number;
  name: string;
  date: string;
}

interface Survey {
  survey_id: number;
  event_id: number;
  date: string;
  duration: string;
  answer_count: number;
}

interface Props {
  events: Event[];
  surveys: Survey[];
}

export default function SurveysManager({ events, surveys: initial }: Props) {
  const [surveys, setSurveys] = useState(initial);
  const [form, setForm] = useState({
    event_id: "",
    date: "",
    duration: "05:00:00",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: parseInt(form.event_id, 10),
          date: form.date,
          duration: form.duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al crear la encuesta");
      } else {
        setForm({ event_id: "", date: "", duration: "05:00:00" });
        window.location.reload();
      }
    } catch {
      setError("Error de red.");
    } finally {
      setLoading(false);
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
          Nueva encuesta
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
            <label htmlFor="date">Fecha de apertura</label>
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
            <label htmlFor="duration">Duración de la encuesta (HH:MM:SS)</label>
            <input
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="05:00:00"
              pattern="\d{2}:\d{2}:\d{2}"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Creando..." : "Crear encuesta"}
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
          Mis encuestas ({surveys.length})
        </h2>
        {surveys.length > 0 ? (
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {surveys.map((s) => {
              const ev = events.find((e) => e.event_id === s.event_id);
              return (
                <li
                  key={s.survey_id}
                  style={{
                    background: "var(--background)",
                    borderRadius: 8,
                    padding: "0.75rem",
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {ev ? ev.name : `Evento #${s.event_id}`}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                    Apertura: {new Date(s.date).toLocaleDateString("es-ES")} · Duración: {s.duration}
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "var(--primary)", fontWeight: 600, marginTop: "0.25rem" }}>
                    {s.answer_count} respuesta{s.answer_count !== 1 ? "s" : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            No hay encuestas.
          </p>
        )}
      </div>
    </div>
  );
}
