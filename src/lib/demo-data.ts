// ---------------------------------------------------------------------------
// Demo data used when NEXT_PUBLIC_DEMO_MODE === 'true' (GitHub Pages build).
// All dates are absolute so the demo always has a mix of past/upcoming events.
// ---------------------------------------------------------------------------

export interface DemoArtist {
  artist_id: number;
  email: string;
  name: string;
  gender: string;
  description: string | null;
  image: string | null;
  twitter: string | null;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  webpage: string | null;
  verified: boolean;
}

export interface DemoEvent {
  event_id: number;
  artist_id: number;
  name: string;
  description: string;
  image: string | null;
  date: string; // YYYY-MM-DD
  duration: string; // HH:MM:SS
  localization: string;
  tickets: string | null;
}

export interface DemoNotification {
  notification_id: number;
  artist_id: number;
  event_id: number;
  title: string;
  description: string | null;
  created_at: string;
}

export interface DemoSurvey {
  survey_id: number;
  artist_id: number;
  event_id: number;
  date: string;
  duration: string;
  answer_count: number;
}

// ---------------------------------------------------------------------------
// Artists
// ---------------------------------------------------------------------------
export const DEMO_ARTISTS: DemoArtist[] = [
  {
    artist_id: 1,
    email: "carmen@demo.livevent.es",
    name: "Carmen de la Vega",
    gender: "Flamenco",
    description:
      "Bailaora y artista flamenca con más de 20 años de trayectoria en los principales escenarios de España y el mundo. Fundadora de la Compañía de Arte Flamenco de la Vega.",
    image: null,
    twitter: "https://twitter.com/carmendelavega",
    facebook: null,
    instagram: "https://instagram.com/carmendelavega",
    youtube: "https://youtube.com/@carmendelavega",
    webpage: "https://carmendelavega.es",
    verified: true,
  },
  {
    artist_id: 2,
    email: "losplanetas@demo.livevent.es",
    name: "Los Planetas",
    gender: "Indie",
    description:
      "Banda indie rock granadina, referente del indie español desde los años 90. Autores de clásicos como «Nueva Ola» y «Segundo Premio».",
    image: null,
    twitter: "https://twitter.com/losplanetas",
    facebook: null,
    instagram: "https://instagram.com/losplanetas",
    youtube: null,
    webpage: null,
    verified: true,
  },
  {
    artist_id: 3,
    email: "djmartinez@demo.livevent.es",
    name: "DJ Martínez",
    gender: "Electrónica",
    description:
      "Productor y DJ de música electrónica con actuaciones en los festivales más importantes de Europa. Conocido por su fusión de techno y flamenco.",
    image: null,
    twitter: null,
    facebook: null,
    instagram: "https://instagram.com/djmartinezoficial",
    youtube: null,
    webpage: null,
    verified: true,
  },
  {
    artist_id: 4,
    email: "bandaroots@demo.livevent.es",
    name: "Banda Roots",
    gender: "Reggae",
    description:
      "Grupo de reggae y ska con más de 500 actuaciones en vivo. Su energía en el escenario es inigualable y su música transmite positividad.",
    image: null,
    twitter: null,
    facebook: "https://facebook.com/bandarootsoficial",
    instagram: null,
    youtube: "https://youtube.com/@bandaroots",
    webpage: "https://bandaroots.es",
    verified: true,
  },
];

// The demo "logged in" artist (used in dashboard, notifications, surveys pages)
export const DEMO_LOGGED_ARTIST = DEMO_ARTISTS[0];

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
export const DEMO_EVENTS: DemoEvent[] = [
  // Upcoming – owned by artist 1
  {
    event_id: 1,
    artist_id: 1,
    name: "Noche de Flamenco en el Palacio",
    description:
      "Una noche mágica de flamenco puro con los mejores artistas del panorama nacional. Disfruta de baile, cante y toque en un espacio único con capacidad para 800 personas.",
    image: null,
    date: "2026-05-15",
    duration: "02:30:00",
    localization: "Palacio de los Deportes, Madrid",
    tickets: "https://entradas.example.com/flamenco-palacio",
  },
  {
    event_id: 2,
    artist_id: 1,
    name: "Gala Flamenca de Verano",
    description:
      "El espectáculo flamenco más esperado del verano vuelve al Teatro Real con un programa renovado que mezcla tradición y vanguardia.",
    image: null,
    date: "2026-06-20",
    duration: "02:00:00",
    localization: "Teatro Real, Madrid",
    tickets: "https://entradas.example.com/gala-verano",
  },
  // Upcoming – owned by artist 2
  {
    event_id: 3,
    artist_id: 2,
    name: "Jazz & Blues Festival",
    description:
      "Tres días de jazz y blues en vivo con artistas internacionales de primera línea. Una celebración de la música en su estado más puro.",
    image: null,
    date: "2026-07-10",
    duration: "03:00:00",
    localization: "Sala Berlín, Barcelona",
    tickets: null,
  },
  // Upcoming – owned by artist 3
  {
    event_id: 4,
    artist_id: 3,
    name: "Electronic Night Vol. 3",
    description:
      "La tercera edición de la noche electrónica más esperada de la temporada. DJ Martínez presenta su nuevo álbum en vivo.",
    image: null,
    date: "2026-07-25",
    duration: "05:00:00",
    localization: "Sala Razzmatazz, Barcelona",
    tickets: "https://entradas.example.com/electronic-night",
  },
  // Past – owned by artist 1
  {
    event_id: 5,
    artist_id: 1,
    name: "Concierto de Navidad",
    description:
      "Un espectáculo flamenco especial para cerrar el año con un broche de oro. Canciones populares reinterpretadas con el sello flamenco de Carmen de la Vega.",
    image: null,
    date: "2025-12-20",
    duration: "02:00:00",
    localization: "Auditorio Nacional, Madrid",
    tickets: null,
  },
  // Past – owned by artist 2
  {
    event_id: 6,
    artist_id: 2,
    name: "Festival de Otoño",
    description:
      "Los Planetas cerraron la temporada de otoño con un concierto inolvidable en el que repasaron toda su discografía.",
    image: null,
    date: "2025-11-10",
    duration: "02:30:00",
    localization: "Sala La Riviera, Madrid",
    tickets: null,
  },
];

// Upcoming events only (date > 2026-04-28)
export const DEMO_UPCOMING_EVENTS = DEMO_EVENTS.filter(
  (e) => e.date > "2026-04-28"
);

// Past events only
export const DEMO_PAST_EVENTS = DEMO_EVENTS.filter(
  (e) => e.date < "2026-04-28"
);

// Events owned by the demo artist (artist_id: 1)
export const DEMO_ARTIST_EVENTS = DEMO_EVENTS.filter(
  (e) => e.artist_id === DEMO_LOGGED_ARTIST.artist_id
);

export const DEMO_ARTIST_UPCOMING_EVENTS = DEMO_ARTIST_EVENTS.filter(
  (e) => e.date > "2026-04-28"
);

export const DEMO_ARTIST_PAST_EVENTS = DEMO_ARTIST_EVENTS.filter(
  (e) => e.date < "2026-04-28"
);

// ---------------------------------------------------------------------------
// Notifications (for demo artist)
// ---------------------------------------------------------------------------
export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  {
    notification_id: 1,
    artist_id: 1,
    event_id: 1,
    title: "¡Últimas entradas disponibles!",
    description: "Quedan menos de 50 entradas para Noche de Flamenco en el Palacio.",
    created_at: "2026-04-20T10:00:00Z",
  },
  {
    notification_id: 2,
    artist_id: 1,
    event_id: 2,
    title: "Cambio de horario",
    description: "La Gala Flamenca de Verano comienza a las 21:30h en lugar de las 21:00h.",
    created_at: "2026-04-22T14:30:00Z",
  },
];

// ---------------------------------------------------------------------------
// Surveys (for demo artist)
// ---------------------------------------------------------------------------
export const DEMO_SURVEYS: DemoSurvey[] = [
  {
    survey_id: 1,
    artist_id: 1,
    event_id: 5,
    date: "2025-12-21",
    duration: "05:00:00",
    answer_count: 48,
  },
];
