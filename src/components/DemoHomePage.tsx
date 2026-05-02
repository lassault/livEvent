"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DEMO_UPCOMING_EVENTS,
  DEMO_PAST_EVENTS,
  type DemoEvent,
} from "@/lib/demo-data";
import styles from "@/app/page.module.css";

type Filter = "past" | "today" | "upcoming";

export default function DemoHomePage() {
  const [filter, setFilter] = useState<Filter>("upcoming");

  const events: DemoEvent[] =
    filter === "past"
      ? DEMO_PAST_EVENTS
      : filter === "today"
        ? []
        : DEMO_UPCOMING_EVENTS;

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Eventos</h1>
        <div className={styles.filters}>
          <button
            onClick={() => setFilter("past")}
            className={filter === "past" ? styles.activeFilter : styles.filter}
          >
            Pasados
          </button>
          <button
            onClick={() => setFilter("today")}
            className={filter === "today" ? styles.activeFilter : styles.filter}
          >
            Hoy
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={
              filter === "upcoming" ? styles.activeFilter : styles.filter
            }
          >
            Próximos
          </button>
        </div>
      </div>

      {events.length > 0 ? (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.event_id} className={styles.card}>
              <Link href={`/events/${event.event_id}`}>
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
        <p className={styles.empty}>
          No hay eventos{" "}
          {filter === "today"
            ? "hoy"
            : filter === "past"
              ? "pasados"
              : "próximos"}
          .
        </p>
      )}
    </main>
  );
}
