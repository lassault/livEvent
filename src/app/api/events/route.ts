import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/events?filter=upcoming|today|past&artistId=123&eventId=456
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const artistId = searchParams.get("artistId");
  const filter = searchParams.get("filter") ?? "upcoming";

  if (eventId) {
    const { data, error } = await supabase
      .from("events")
      .select(
        "event_id, artist_id, name, description, image, date, duration, localization, tickets"
      )
      .eq("event_id", parseInt(eventId, 10))
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  const today = new Date().toISOString().split("T")[0];
  let query = supabase
    .from("events")
    .select("event_id, artist_id, name, description, image, date, duration, localization, tickets");

  if (artistId) {
    query = query.eq("artist_id", parseInt(artistId, 10));
  }

  if (filter === "past") {
    query = query.lt("date", today).order("date", { ascending: false });
  } else if (filter === "today") {
    query = query.eq("date", today).order("date", { ascending: true });
  } else {
    query = query.gt("date", today).order("date", { ascending: true });
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST /api/events  — create event (artist must be logged in)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, image, date, duration, localization, tickets } = body;

  if (!name || !description || !date || !localization) {
    return NextResponse.json(
      { error: "Nombre, descripción, fecha y localización son obligatorios" },
      { status: 400 }
    );
  }

  // Get artist_id for this user
  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id")
    .eq("email", user.email!)
    .single();

  if (!artist) {
    return NextResponse.json({ error: "Artista no encontrado" }, { status: 404 });
  }

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      artist_id: artist.artist_id,
      name,
      description,
      image: image || null,
      date,
      duration: duration || "02:00:00",
      localization,
      tickets: tickets || null,
    })
    .select("event_id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Error al crear el evento" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, event_id: event.event_id }, { status: 201 });
}

// DELETE /api/events?eventId=123
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "eventId requerido" }, { status: 400 });
  }

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id")
    .eq("email", user.email!)
    .single();

  if (!artist) {
    return NextResponse.json({ error: "Artista no encontrado" }, { status: 404 });
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("event_id", parseInt(eventId, 10))
    .eq("artist_id", artist.artist_id);

  if (error) {
    return NextResponse.json({ error: "Error al eliminar el evento" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
