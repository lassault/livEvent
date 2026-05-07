import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/surveys?artistId=...
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");

  let query = supabase
    .from("survey_index")
    .select("survey_id, artist_id, event_id, date, duration, created_at")
    .order("date", { ascending: false });

  if (artistId) {
    query = query.eq("artist_id", parseInt(artistId, 10));
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Error al obtener encuestas" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST /api/surveys  — create survey (artist must be logged in)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { event_id, date, duration } = body;

  if (!event_id || !date) {
    return NextResponse.json(
      { error: "event_id y fecha son obligatorios" },
      { status: 400 }
    );
  }

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id")
    .eq("email", user.email!)
    .single();

  if (!artist) {
    return NextResponse.json({ error: "Artista no encontrado" }, { status: 404 });
  }

  // Check if survey already exists for this event
  const { data: existing } = await supabase
    .from("survey_index")
    .select("survey_id")
    .eq("artist_id", artist.artist_id)
    .eq("event_id", event_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Ya existe una encuesta para ese evento" },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("survey_index").insert({
    artist_id: artist.artist_id,
    event_id,
    date,
    duration: duration || "05:00:00",
  });

  if (error) {
    return NextResponse.json({ error: "Error al crear la encuesta" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
