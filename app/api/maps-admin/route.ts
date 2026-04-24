import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET all maps including unpublished (admin only)
export async function GET() {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("maps")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ maps: data ?? [] });
  } catch (err) {
    console.error("GET /api/maps-admin error:", err);
    return NextResponse.json({ maps: [], error: "Erreur serveur" }, { status: 500 });
  }
}
