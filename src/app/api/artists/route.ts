import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/artists  — list verified artists
// GET /api/artists?id=123  — get single artist
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await supabase
      .from("artists")
      .select(
        "artist_id, name, gender, description, image, twitter, facebook, instagram, youtube, webpage"
      )
      .eq("artist_id", parseInt(id, 10))
      .eq("verified", true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Artista no encontrado" }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  const { data, error } = await supabase
    .from("artists")
    .select("artist_id, name, description, image")
    .eq("verified", true)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Error al obtener artistas" }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

// POST /api/artists  — register new artist
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password, gender, description, image, twitter, facebook, instagram, youtube, webpage } = body;

  if (!name || !email || !password || !gender) {
    return NextResponse.json(
      { error: "Nombre, email, contraseña y género son obligatorios" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Check if name or email already exists
  const { data: existing } = await supabase
    .from("artists")
    .select("artist_id")
    .or(`name.eq.${name},email.eq.${email}`)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Ya existe un artista con ese nombre o email" },
      { status: 409 }
    );
  }

  // Register auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "artist" } },
  });

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message ?? "Error al registrar el usuario" },
      { status: 500 }
    );
  }

  // Insert artist record
  const { error: insertError } = await supabase.from("artists").insert({
    email,
    name,
    gender,
    description: description || null,
    image: image || null,
    twitter: twitter || null,
    facebook: facebook || null,
    instagram: instagram || null,
    youtube: youtube || null,
    webpage: webpage || null,
    verified: false,
  });

  if (insertError) {
    return NextResponse.json({ error: "Error al guardar el artista" }, { status: 500 });
  }

  return NextResponse.json(
    { ok: true, message: "Artista registrado. Pendiente de verificación." },
    { status: 201 }
  );
}
