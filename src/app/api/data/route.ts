import { NextResponse } from "next/server";
import { fetchDailyData, fetchWeeklyData } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") || "daily";

  try {
    const rows = view === "weekly" ? await fetchWeeklyData() : await fetchDailyData();
    return NextResponse.json(
      { rows, fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    return NextResponse.json(
      { error: "Erro ao carregar dados da Google Sheet", rows: [] },
      { status: 500 }
    );
  }
}
