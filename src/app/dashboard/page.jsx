import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getUserFromCookie } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUserFromCookie();

  if (!user) redirect("/login");

  return <DashboardClient />;
}
