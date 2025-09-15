// app/api/invites/[projectId]/accept/route.js
import { connectDB } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { Project } from '@/models/ProjectModel';

export async function POST(_, { params }) {
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const project = await Project.findById(params.projectId);
  if (!project) return new Response("Project not found", { status: 404 });

  const member = project.members.find(m => m.user.toString() === user._id.toString());
  if (!member) return new Response("No invite found", { status: 400 });

  member.status = 'accepted';
  await project.save();

  return new Response("Invite accepted", { status: 200 });
}
