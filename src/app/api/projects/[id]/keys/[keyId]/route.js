import { connectDB } from "@/lib/db";
import { getUserFromCookie } from "@/lib/auth";
import { Project } from "@/models/ProjectModel";

export async function PATCH(req, { params }) {
  const { id, keyId } = params; 
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { name, key, value, type, description } = await req.json();
  const project = await Project.findById(id);
  if (!project) return new Response("Project not found", { status: 404 });

  const keyToEdit = project.keys.id(keyId);
  if (!keyToEdit) return new Response("Key not found", { status: 404 });

  const isOwner = project.owner.toString() === user._id.toString();
  const isEditor = project.members?.some(
    (m) => m.user.toString() === user._id.toString() && m.role === "editor"
  );
  if (!isOwner && !isEditor)
    return new Response("Not authorized", { status: 403 });

  keyToEdit.name = name;
  keyToEdit.key = key;
  keyToEdit.value = value;
  keyToEdit.type = type;
  keyToEdit.description = description;

  project.activity.push({
    message: `${user.username} updated a key "${name}"`,
    user: user._id,
  });

  await project.save();
  return Response.json({ success: true, project });
}

export async function DELETE(req, { params }) {
  const { id, keyId } = params; // yahan bhi await ki zarurat nahi
  await connectDB();
  const user = await getUserFromCookie();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const project = await Project.findById(id);
  if (!project) return new Response("Project not found", { status: 404 });

  const keyToEdit = project.keys.id(keyId);

  const isOwner = project.owner.toString() === user._id.toString();
  const isEditor = project.members?.some(
    (m) => m.user.toString() === user._id.toString() && m.role === "editor"
  );
  if (!isOwner && !isEditor)
    return new Response("Not authorized", { status: 403 });

  project.keys = project.keys.filter((k) => k._id.toString() !== keyId);
  project.activity.push({
    message: `${user.username} deleted a key ${keyToEdit.name}`,
    user: user._id,
  });

  await project.save();

  return Response.json({ success: true });
}
