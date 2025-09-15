// dashboard route

import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const user = await getUserFromCookie();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const projects = await Project.find({
    $or: [
      { owner: user._id },
      { members: { $elemMatch: { user: user._id, status: "accepted" } } }
    ]
  })
    .populate("owner", "_id username") // ✅ Owner username
    .populate("members.user", "_id username") // ✅ Members username
    .sort({ createdAt: -1 })
    .lean(); // ✅ Plain JS object banane ke liye

  // ✅ Add keyCount for each project
  const projectsWithKeyCount = projects.map(project => ({
    ...project,
    keyCount: project.keys?.length || 0
  }));

  return new Response(JSON.stringify(projectsWithKeyCount), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
