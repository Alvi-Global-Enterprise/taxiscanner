import { requireAdminOrRedirect } from "@/lib/adminPageGuard";
import { AdminOperatorZoneManager } from "@/components/admin/AdminOperatorZoneManager";

export default function AdminOperatorsPage() {
  requireAdminOrRedirect("/admin/operators");

  return <AdminOperatorZoneManager withShell />;
}
