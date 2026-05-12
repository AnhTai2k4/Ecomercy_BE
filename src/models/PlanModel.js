import mongoose from 'mongoose';
const GoalSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  goals: [{
    content: String,
    category: String,
    isAchieved: { type: Boolean, default: false }
  }],
  status: { type: String, default: 'active' }
});

const dailyActionSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  goalId: { type: Schema.Types.ObjectId, ref: 'Goal' }, // Kết nối tới bảng Mục tiêu
  date: { type: Date, required: true },
  tasks: [{
    title: String,
    expectedHours: Number,
    actualHours: Number,
    isCompleted: { type: Boolean, default: false }
  }],
  aiScore: Number,
  aiFeedback: String,
  status: { type: String, enum: ['draft', 'submitted'], default: 'draft' }
});
const periodicSummarySchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['weekly', 'monthly'], required: true },
  referencePeriod: Number, // Số tuần hoặc Số tháng
  year: Number,
  totalHours: Number,
  achievementRate: Number, // % hoàn thành mục tiêu
  teacherComment: String,
  teacherScore: Number,
  status: { type: String, default: 'pending' }
});