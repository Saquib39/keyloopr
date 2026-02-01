import { connectDB } from "@/lib/db";
import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";
import { encryptSecret, decryptSecret } from "@/lib/crypto";

export async function POST(req, { params }) {
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } =await params; 
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

  // 🔒 Encrypt the value before saving
  const encryptedValue = encryptSecret(value);

  project.keys.push({ name, key, value: encryptedValue, type, description, createdBy: user._id });

  project.activity.push({
    message: `${user.username} added a new key "${name}"`,
    user: user._id,
  });

  await project.save();

  return new Response(JSON.stringify({ success: true, project }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(_, { params }) {
  await connectDB();
  const { id } = await params;
  const project = await Project.findById(id);
  if (!project) return new Response("Project not found", { status: 404 });

  // 🔓 Decrypt before sending
  const decryptedKeys = project.keys.map((k) => ({
    ...k.toObject(),
    value: k.value ? decryptSecret(k.value) : "",
  }));

  return new Response(JSON.stringify(decryptedKeys), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
