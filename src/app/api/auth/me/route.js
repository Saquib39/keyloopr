// app/api/auth/me/route.js
import { getUserFromCookie } from "@/lib/auth";
import { connectDB } from "@/lib/db";


export async function GET() {
  await connectDB();
  const user = await getUserFromCookie();

  if (!user) {
    return new Response(JSON.stringify({ isLoggedIn: false }), { status: 200 });
  }
  return new Response(JSON.stringify({ isLoggedIn: true, user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
