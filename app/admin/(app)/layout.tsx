import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-body bg-paper text-ink antialiased">
      <AdminSidebar />
      <main className="ml-56 min-h-screen">{children}</main>
    </div>
  );
}
