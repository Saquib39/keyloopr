import { connectDB } from "@/lib/db";
import { Project } from "@/models/ProjectModel";
import { getUserFromCookie } from "@/lib/auth";

export async function GET(req, { params }) {
  await connectDB();

  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  try {
    const { id } = await params; // ✅ FIX: await params
    const project = await Project.findById(id)
      .populate("owner", "_id username")
      .populate("members.user", "_id username");

    if (!project) {
      return new Response("Project not found", { status: 404 });
    }

    // Send currentUserId too
    const result = {
      ...project.toObject(),
      currentUserId: user._id.toString(),
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response("Error fetching project", { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params; // ✅ FIX
  const { name, description, access, status } = await req.json();

  const project = await Project.findById(id);
  if (!project) return new Response("Project not found", { status: 404 });

  // Only owner can edit project
  if (project.owner.toString() !== user._id.toString()) {
    return new Response("Only the owner can edit this project", { status: 403 });
  }

  project.name = name;
  project.description = description;
  project.access = access;
  project.status = status;

  await project.save();

  return new Response("Project updated successfully", { status: 200 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await params; // ✅ FIX

  const project = await Project.findById(id);
  if (!project) return new Response("Project not found", { status: 404 });

  // Only owner can delete project
  if (project.owner.toString() !== user._id.toString()) {
    return new Response("Only the owner can delete this project", { status: 403 });
  }

  await Project.findByIdAndDelete(id);

  return new Response("Project deleted successfully", { status: 200 });
}
