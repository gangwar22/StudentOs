import mongoose from 'mongoose';

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
  videos: { type: mongoose.Schema.Types.Mixed },
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

export const CurriculumPhase = mongoose.models.CurriculumPhase || mongoose.model('CurriculumPhase', CurriculumPhaseSchema);
