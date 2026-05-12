const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    slug: { type: String, required: true }, // Thêm field slug cho lesson
    // THÊM 3 TRƯỜNG NÀY VÀO:
    videoType: { type: String, enum: ['youtube', 'vimeo', 'bunny'], default: 'youtube' },
    videoId: { type: String }, // Ví dụ: 'dQw4w9WgXcQ' (nếu là Youtube) hoặc '123456789' (nếu là Vimeo)
    duration: { type: String }, // Thời lượng (VD: "50:28")
    
    isFree: { type: Boolean, default: false }
});

const sectionSchema = new mongoose.Schema({
    sectionTitle: String,
    lessons: [lessonSchema] // Danh sách bài học con
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Cái này CỰC KỲ QUAN TRỌNG để làm URL
    price: { type: Number, required: true },
    rating: { type: Number, default: 5.0 },
    reviews: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    overview: { type: String }, // Tóm tắt cấu trúc
    description: { type: String }, // Bài viết chi tiết (HTML)
    sections: [sectionSchema], // Lộ trình học (Accordion)
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);