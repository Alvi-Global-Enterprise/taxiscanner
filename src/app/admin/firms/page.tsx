import { requireAdminOrRedirect } from "@/lib/adminPageGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminFirmsPostcodeManager } from "@/components/admin/AdminFirmsPostcodeManager";

export default function AdminFirmsPage() {
  requireAdminOrRedirect("/admin/firms");

  return (
    <AdminShell
      title="Firms & Postcodes"
      subtitle="Assign UK postcodes so only covering firms appear in customer compare."
    >
      <AdminFirmsPostcodeManager />
    </AdminShell>
  );
}
