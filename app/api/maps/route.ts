import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET — public: fetch published maps
export async function GET() {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("maps")
      .select("*")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ maps: data ?? [] });
  } catch (err) {
    console.error("GET /api/maps error:", err);
    return NextResponse.json({ maps: [], error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — admin: create a new map record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, categorie, cloudinary_url, cloudinary_public_id, fiche_key, published, display_order } = body;

    if (!title || !cloudinary_url || !fiche_key) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const db = supabaseAdmin();
    const { data, error } = await db
      .from("maps")
      .insert([{ title, categorie, cloudinary_url, cloudinary_public_id, fiche_key, published: published ?? false, display_order: display_order ?? 0 }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ map: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/maps error:", err);
    return NextResponse.json({ error: "Erreur création" }, { status: 500 });
  }
}

// PATCH — admin: update map
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const db = supabaseAdmin();
    const { data, error } = await db.from("maps").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ map: data });
  } catch (err) {
    console.error("PATCH /api/maps error:", err);
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}

// DELETE — admin: delete map
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const db = supabaseAdmin();
    const { error } = await db.from("maps").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/maps error:", err);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
