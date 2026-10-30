import { requireAdminOrRedirect } from "@/lib/adminPageGuard";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminStatsDashboard } from "@/components/admin/AdminStatsDashboard";

export default function AdminStatsPage() {
  requireAdminOrRedirect("/admin/stats");

  return (
    <AdminShell
      title="Statistics"
      subtitle="Compare impressions and booking-link clicks per taxi firm."
    >
      <AdminStatsDashboard />
    </AdminShell>
  );
}
