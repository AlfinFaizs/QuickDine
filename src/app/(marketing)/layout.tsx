import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { createClient } from "@/lib/supabase/server";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | null = null;
  let userRole: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userEmail = user.email || null;
      userRole = (user.app_metadata?.role as string) || "customer";
    }
  } catch {
    // Supabase credentials might not be configured yet during dev/mock
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8ff]">
      <Navbar userEmail={userEmail} userRole={userRole} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
