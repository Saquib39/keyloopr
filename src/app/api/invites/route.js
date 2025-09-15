import { connectDB } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { Project } from '@/models/ProjectModel';

export async function GET() {
  await connectDB();
  const user = await getUserFromCookie();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Find all projects where user is in members[] with status "pending"
  const invites = await Project.find({
    'members.user': user._id,
    'members.status': 'pending'
  })
    .populate('owner', 'username')
    .select('name description owner members');

  // Filter each project to show only the current user's invite info
  const userInvites = invites.map(project => {
    const memberInfo = project.members.find(m => m.user.toString() === user._id.toString());
    return {
      projectId: project._id,
      name: project.name,
      description: project.description,
      invitedBy: project.owner.username,
      role: memberInfo.role,
      status: memberInfo.status,
    };
  });

  return new Response(JSON.stringify(userInvites), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
