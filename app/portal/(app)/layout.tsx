import { createClient } from "@/lib/supabase/server";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { ClientDataProvider } from "@/lib/portal/ClientDataContext";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let client = null;
  if (user) {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      client = data;
    } else if (error && user.email) {
      // Fallback used by the original dashboard.html: if no client row is
      // linked to this auth user yet, match by email and link it now.
      const { data: byEmail } = await supabase
        .from("clients")
        .select("*")
        .eq("email", user.email)
        .single();

      if (byEmail) {
        await supabase
          .from("clients")
          .update({ user_id: user.id })
          .eq("email", user.email);
        client = byEmail;
      }
    }
  }

  return (
    <div className="font-body bg-paper text-ink antialiased">
      <PortalSidebar companyName={client?.company ?? undefined} />
      <main className="ml-56 min-h-screen">
        <ClientDataProvider client={client}>{children}</ClientDataProvider>
      </main>
    </div>
  );
}
