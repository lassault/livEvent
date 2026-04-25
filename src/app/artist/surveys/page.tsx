import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SurveysManager from "./SurveysManager";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function SurveysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/artist/login");

  const { data: artist } = await supabase
    .from("artists")
    .select("artist_id, name")
    .eq("email", user.email!)
    .single();

  if (!artist) redirect("/artist/login");

  const { data: events } = await supabase
    .from("events")
    .select("event_id, name, date")
    .eq("artist_id", artist.artist_id)
    .order("date", { ascending: false });

  const { data: surveys } = await supabase
    .from("survey_index")
    .select("survey_id, event_id, date, duration, created_at")
    .eq("artist_id", artist.artist_id)
    .order("date", { ascending: false });

  // Get answer counts per survey
  const surveyIds = (surveys ?? []).map((s) => s.survey_id);
  const { data: answerCounts } =
    surveyIds.length > 0
      ? await supabase
          .from("survey_answers")
          .select("survey_id")
          .in("survey_id", surveyIds)
      : { data: [] };

  const countBySurvey: Record<number, number> = {};
  for (const row of answerCounts ?? []) {
    countBySurvey[row.survey_id] = (countBySurvey[row.survey_id] ?? 0) + 1;
  }

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <Link href="/artist/dashboard" style={{ color: "var(--primary)", fontSize: "0.9rem", fontWeight: 500 }}>
            ← Panel
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Encuestas</h1>
        </div>
        <SurveysManager
          events={events ?? []}
          surveys={(surveys ?? []).map((s) => ({
            ...s,
            answer_count: countBySurvey[s.survey_id] ?? 0,
          }))}
        />
      </main>
    </>
  );
}
