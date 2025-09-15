// app/api/auth/register/route.js
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { username, password } = await req.json();

  const existing = await User.findOne({ username });
  if (existing) {
    return new Response("Username already taken", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  return new Response("User registered", { status: 201 });
}
