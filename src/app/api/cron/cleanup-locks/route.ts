import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();

    // Call PostgreSQL RPC function cleanup_expired_locks
    const { data: unlockedCount, error } = await supabaseAdmin.rpc("cleanup_expired_locks");

    if (error) {
      console.error("[Cron Cleanup Locks Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      unlockedCount: unlockedCount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("[Cron Cleanup Locks Failed]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
