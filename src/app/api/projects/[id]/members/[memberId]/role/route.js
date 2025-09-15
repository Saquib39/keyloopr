// /api/projects/[id]/members/[memberId]/role/route.js
import { connectDB } from "@/lib/db";
import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";

export async function PATCH(req, context) {
  await connectDB();

  const { params } = context;
  const { id: projectId, memberId } = params;

  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { newRole } = await req.json();

  const project = await Project.findById(projectId);
  if (!project) return new Response("Project not found", { status: 404 });

  const member = project.members.find(m => m.user.toString() === memberId);
  if (!member) return new Response("Member not found", { status: 404 });

  member.role = newRole;
  await project.save();

  const updated = await Project.findById(projectId)
    .populate('owner', '_id username')
    .populate('members.user', '_id username');

  return Response.json({
    ...updated.toObject(),
    currentUserId: user._id,
  });
}

