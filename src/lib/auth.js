// lib/auth.js
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import { User } from '@/models/User';

export async function getUserFromCookie() {
  await connectDB();

  const cookieStore = await cookies(); // ✅ Must be awaited
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('❌ No token found');
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('_id username');
    return user;
  } catch (err) {
    console.log('❌ JWT error:', err.message);
    return null;
  }
}
