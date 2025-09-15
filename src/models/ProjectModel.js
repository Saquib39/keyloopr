

// File 1: models/ProjectModel.js (Updated Model)
import mongoose from 'mongoose';
const activitySchema = new mongoose.Schema({
  message: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
});

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['editor', 'viewer'], required: true },
  status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
}, { _id: false });

const keySchema = new mongoose.Schema({
  name: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, enum: ['apikey', 'secret', 'token', 'env'], default: 'secret' },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, trim: true },
  description: { type: String, default: '', trim: true },
  access: { type: String, enum: ['personal', 'team'], default: 'personal' },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  keys: [keySchema],
  activity: [activitySchema], // 🔥 Added activity log

}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
