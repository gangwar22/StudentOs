import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  category: { type: String },
  level: { type: String },
  duration: { type: String },
  rating: { type: Number },
  enrolledCount: { type: Number },
  instructor: { type: String },
  image: { type: String },
  description: { type: String },
  learningObjectives: [{ type: String }],
  modules: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
