import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Use inside Client Components ("use client").
 * Replaces: <script src="js/supabase.js"></script> and the global `db`.
 *
 *   import { createClient } from "@/lib/supabase/client";
 *   const supabase = createClient();
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
