import { connectDB } from "@/lib/db";
import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";

export async function DELETE(_, { params }) {
  await connectDB();
  const projectId = params.id; // ✅ use only this
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const project = await Project.findById(projectId); // ✅ fix here
  if (!project) return new Response("Project not found", { status: 404 });

  // Don't allow owner to leave
  if (project.owner.toString() === user._id.toString()) {
    return new Response("Owner cannot leave their own project", { status: 400 });
  }

  // Remove user from members[]
  project.members = project.members.filter(m => m.user.toString() !== user._id.toString());
  await project.save();

  return new Response("Left project", { status: 200 });
}
