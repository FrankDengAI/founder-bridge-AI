import { redirect } from "next/navigation";
import { isDemoLoginEnabled } from "@/lib/auth/config";
import { AdminDemoClient } from "./AdminDemoClient";

export default function AdminDemoPage() {
  if (!isDemoLoginEnabled()) {
    redirect("/workspace");
  }
  return <AdminDemoClient />;
}
