import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role (for admin operations)
export const supabaseAdmin = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

export interface MapRecord {
  id: string;
  title: string;
  categorie: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  fiche_key: string;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
