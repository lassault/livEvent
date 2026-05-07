import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/events/[id]  — update event (artist must be logged in and own the event)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id")
    .eq("email", user.email!)
    .single();

  if (!artist) {
    return NextResponse.json({ error: "Artista no encontrado" }, { status: 404 });
  }

  const body = await request.json();
  const { name, description, image, date, duration, localization, tickets } = body;

  const { error } = await supabase
    .from("events")
    .update({
      name,
      description,
      image: image || null,
      date,
      duration,
      localization,
      tickets: tickets || null,
    })
    .eq("event_id", eventId)
    .eq("artist_id", artist.artist_id);

  if (error) {
    return NextResponse.json({ error: "Error al actualizar el evento" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
