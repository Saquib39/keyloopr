// app/api/invites/[projectId]/reject/route.js
import { connectDB } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { Project } from '@/models/ProjectModel';

export async function POST(_, { params }) {
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const project = await Project.findById(params.projectId);
  if (!project) return new Response("Project not found", { status: 404 });

  const memberIndex = project.members.findIndex(m => m.user.toString() === user._id.toString());
  if (memberIndex === -1) return new Response("No invite found", { status: 400 });

  project.members.splice(memberIndex, 1); // remove invite
  await project.save();

  return new Response("Invite rejected", { status: 200 });
}
