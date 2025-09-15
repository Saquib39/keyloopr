import { connectDB } from "@/lib/db";
import { Project } from "@/models/ProjectModel";
import { User } from "@/models/User";
import { getUserFromCookie } from "@/lib/auth";

export async function POST(req, { params }) {
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const project = await Project.findById(params.id);
  if (!project) return new Response("Project not found", { status: 404 });

  // ✅ Only owner can invite
  if (project.owner.toString() !== user._id.toString()) {
    return new Response("Only project owner can invite members", { status: 403 });
  }

  const { username, role, message } = await req.json();

  // ✅ Validate inputs
  if (!username || !role) {
    return new Response("Username and role are required", { status: 400 });
  }

  const userToInvite = await User.findOne({ username });
  if (!userToInvite) {
    return new Response("User not found", { status: 404 });
  }

  // ✅ Check if already a member
  const alreadyMember = project.members.find((m) =>
    m.user.toString() === userToInvite._id.toString()
  );
  if (alreadyMember) {
    return new Response("User already invited or a member", { status: 400 });
  }

  // ✅ Add member with 'pending' status
  project.members.push({
    user: userToInvite._id,
    role,
    status: "pending",
  });

  await project.save();

  return new Response(JSON.stringify({ message: "Invite sent successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
