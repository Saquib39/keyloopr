import { RecentActivity } from "@/models/RecentActivityModel";

import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";
import { connectDB } from "@/lib/db";

export async function POST(req) {
 await connectDB();
  const user = await getUserFromCookie();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return new Response("Invalid content type", { status: 400 });
  }

  const { name, description, access, status } = await req.json();

  const newProject = new Project({
    name,
    description,
    owner: user._id,
    access,
    status,
    members: [
      {
        user: user._id,
        role: 'editor',
        status: 'accepted',
      }
    ]
  });
  await newProject.save();

// After project save:
await RecentActivity.create({
  projectId: newProject._id,
  projectName: newProject.name,
  message: `${user.username} created project "${newProject.name}"`,
  user: user._id,
});

  return new Response(JSON.stringify({
    message: "Project created successfully",
    project: newProject.toObject(),
  }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}


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
    .populate("owner", "_id username")                     // ✅ Get owner's username
    .populate("members.user", "_id username")              // ✅ Get each member's username
    .sort({ createdAt: -1 });

  return new Response(JSON.stringify(projects), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
