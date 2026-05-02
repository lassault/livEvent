import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/notifications?artistId=...
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");

  let query = supabase
    .from("notifications")
    .select("notification_id, artist_id, event_id, title, description, image, created_at")
    .order("created_at", { ascending: false });

  if (artistId) {
    query = query.eq("artist_id", parseInt(artistId, 10));
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST /api/notifications  — create notification (artist must be logged in)
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { event_id, title, description, image } = body;

  if (!event_id || !title) {
    return NextResponse.json(
      { error: "event_id y título son obligatorios" },
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

  // Max 3 notifications per event
  const { count } = await supabase
    .from("notifications")
    .select("notification_id", { count: "exact", head: true })
    .eq("artist_id", artist.artist_id)
    .eq("event_id", event_id);

  if ((count ?? 0) >= 3) {
    return NextResponse.json(
      { error: "Máximo 3 notificaciones por evento" },
      { status: 409 }
    );
  }

  const { error } = await supabase.from("notifications").insert({
    artist_id: artist.artist_id,
    event_id,
    title,
    description: description || null,
    image: image || null,
  });

  if (error) {
    return NextResponse.json({ error: "Error al crear la notificación" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

// DELETE /api/notifications?notificationId=...
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const notificationId = searchParams.get("notificationId");

  if (!notificationId) {
    return NextResponse.json({ error: "notificationId requerido" }, { status: 400 });
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
    .from("notifications")
    .delete()
    .eq("notification_id", parseInt(notificationId, 10))
    .eq("artist_id", artist.artist_id);

  if (error) {
    return NextResponse.json({ error: "Error al eliminar la notificación" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
