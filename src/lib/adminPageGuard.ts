import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
} from "@/lib/adminAuth";

export function requireAdminOrRedirect(nextPath: string): void {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(token)) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
}
