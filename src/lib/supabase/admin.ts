import { createClient } from "@supabase/supabase-js";

// Admin client with service_role key to bypass RLS for trusted backend operations
// (such as payment webhooks and atomic state transitions)
export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
