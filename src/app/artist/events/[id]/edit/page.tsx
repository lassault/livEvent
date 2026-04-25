import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditEventForm from "./EditEventForm";
import Navbar from "@/components/Navbar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/artist/login");

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id")
    .eq("email", user.email!)
    .single();

  if (!artist) redirect("/artist/login");

  const { data: event } = await supabase
    .from("events")
    .select("event_id, name, description, image, date, duration, localization, tickets")
    .eq("event_id", eventId)
    .eq("artist_id", artist.artist_id)
    .single();

  if (!event) notFound();

  return (
    <>
      <Navbar />
      <EditEventForm event={event} />
    </>
  );
}
