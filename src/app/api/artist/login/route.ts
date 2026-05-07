import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/artist/login
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email y contraseña son obligatorios" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json(
      { error: "Email o contraseña incorrectos" },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/artist/login  (logout)
export async function DELETE() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
