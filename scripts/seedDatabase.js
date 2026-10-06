import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { curriculumPhases } from '../src/data/curriculumPhases.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://rahulg_db_user:qR5Faohu2FV9qYEc@cluster0.32krttd.mongodb.net/Learning_Data?retryWrites=true&w=majority&appName=Cluster0";

// Define Mongoose Schemas
const CurriculumPhaseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  phaseNumber: { type: Number, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  status: { type: String, default: 'active' },
  icon: { type: String },
  badge: { type: String },
  deadlineDays: { type: Number },
  masterVideo: { type: mongoose.Schema.Types.Mixed },
  mainProject: { type: mongoose.Schema.Types.Mixed },
  introduction: { type: mongoose.Schema.Types.Mixed },
  es6ConceptsTable: { type: mongoose.Schema.Types.Mixed },
  backendConceptsTable: { type: mongoose.Schema.Types.Mixed },
  topicMatrix: { type: mongoose.Schema.Types.Mixed },
  logicPuzzles: { type: mongoose.Schema.Types.Mixed },
  quizFeatures: { type: mongoose.Schema.Types.Mixed },
  pageBreakdown: { type: mongoose.Schema.Types.Mixed },
  miniProjects: { type: mongoose.Schema.Types.Mixed },
  conceptVideos: { type: mongoose.Schema.Types.Mixed },
  videoSubmission: { type: mongoose.Schema.Types.Mixed },
  learningOutcomes: { type: mongoose.Schema.Types.Mixed },
  resources: { type: mongoose.Schema.Types.Mixed },
  rubrics: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

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

const CurriculumPhase = mongoose.models.CurriculumPhase || mongoose.model('CurriculumPhase', CurriculumPhaseSchema);
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas database Learning_Data...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    let dummyCourses = [];
    const coursesPath = path.join(__dirname, '../src/data/dummyCourses.json');
    if (fs.existsSync(coursesPath)) {
      const dummyCoursesRaw = fs.readFileSync(coursesPath, 'utf8');
      dummyCourses = JSON.parse(dummyCoursesRaw);
    }

    console.log(`Seeding ${curriculumPhases.length} Curriculum Phases into MongoDB...`);
    for (const phase of curriculumPhases) {
      await CurriculumPhase.findOneAndUpdate(
        { id: phase.id },
        phase,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  ✓ Phase ${phase.phaseNumber} (${phase.id}) saved/updated.`);
    }

    console.log(`Seeding ${dummyCourses.length} Courses into MongoDB...`);
    for (const course of dummyCourses) {
      await Course.findOneAndUpdate(
        { id: course.id },
        course,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`  ✓ Course "${course.title}" (${course.id}) saved/updated.`);
    }

    const totalPhases = await CurriculumPhase.countDocuments();
    const totalCourses = await Course.countDocuments();

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`   - Total Curriculum Phases in MongoDB: ${totalPhases}`);
    console.log(`   - Total Courses in MongoDB: ${totalCourses}`);
    console.log(`   - Target Database: Learning_Data`);
    console.log(`   - Connection String: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding MongoDB Database:', error);
    process.exit(1);
  }
}

seedDatabase();
