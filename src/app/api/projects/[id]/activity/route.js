import { connectDB } from '@/lib/db';
import { Project } from '@/models/ProjectModel';

export async function GET(_, { params }) {
  await connectDB();

  const { id } = await params;
  const project = await Project.findById(id)
    .populate('activity.user', 'username')
    .select('activity');

  if (!project) return new Response('Project not found', { status: 404 });

  return Response.json(project.activity || []);
}
