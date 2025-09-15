// /api/projects/[id]/members/[memberId]/route.js

import { connectDB } from "@/lib/db";
import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";

export async function DELETE(req, context) {
  await connectDB();

  const { params } = context;
  const { id: projectId, memberId } = params;

  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const project = await Project.findById(projectId);
  if (!project) return new Response("Project not found", { status: 404 });

  if (project.owner.toString() !== user._id.toString()) {
    return new Response("Only owner can remove members", { status: 403 });
  }

  // Remove member
  project.members = project.members.filter(
    (m) => m.user.toString() !== memberId
  );
  await project.save();

  const updated = await Project.findById(projectId)
    .populate("owner", "_id username")
    .populate("members.user", "_id username");

  return Response.json({
    ...updated.toObject(),
    currentUserId: user._id,
  });
}
