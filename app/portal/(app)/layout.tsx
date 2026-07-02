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
    const { data } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .single();
    client = data;
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
