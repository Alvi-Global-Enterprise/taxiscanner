import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
} from "@/lib/adminAuth";

export default function AdminIndexPage() {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidAdminSessionToken(token)) {
    redirect("/admin/login?next=%2Fadmin%2Ffirms");
  }
  redirect("/admin/firms");
}
