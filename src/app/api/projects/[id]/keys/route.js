// ===== 📁 app/api/projects/[id]/keys/route.js =====

import { connectDB } from "@/lib/db";
import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";

export async function POST(req, { params }) {
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params; 
  const { name, key, value, type, description } = await req.json();

  const project = await Project.findById(id);
  if (!project) return new Response("Project not found", { status: 404 });

  // Check if user is editor or owner
  const isOwner = project.owner.toString() === user._id.toString();
  const isEditor = project.members?.some(
    (m) => m.user.toString() === user._id.toString() && m.role === "editor"
  );
  if (!isOwner && !isEditor)
    return new Response("Not authorized", { status: 403 });

  project.keys.push({ name, key, value, type, description, createdBy: user._id });

  project.activity.push({
    message: `${user.username} added a new key "${name}"`,
    user: user._id,
  });

  await project.save();

  return Response.json({ success: true, project });
}

export async function GET(_, { params }) {
  await connectDB();
  const { id } = await params; // ✅ FIX: await params
  const project = await Project.findById(id);
  if (!project) return new Response("Project not found", { status: 404 });

  return new Response(JSON.stringify(project.keys), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
