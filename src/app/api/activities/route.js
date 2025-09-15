import { connectDB } from "@/lib/db";
import { RecentActivity } from "@/models/RecentActivityModel";
import { getUserFromCookie } from "@/lib/auth"; 

export async function GET() {
  await connectDB();

  const user = await getUserFromCookie();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const activities = await RecentActivity.find({ user: user._id }) 
    .populate("user", "username")
    .sort({ createdAt: -1 })
    .limit(10);

  return Response.json(activities);
}
