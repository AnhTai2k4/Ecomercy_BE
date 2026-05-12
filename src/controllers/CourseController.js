const Course = require('../models/CourseModel');

const createCourse = async (req, res) => {
  try {
    const { title, slug, price, overview, description, sections } = req.body;

    if (!title || !slug || price == null) {
      return res.status(400).json({ message: 'Thiếu thông tin khóa học bắt buộc.' });
    }

    const existingCourse = await Course.findOne({ slug });
    if (existingCourse) {
      return res.status(409).json({ message: 'Slug khóa học đã tồn tại.' });
    }

    const course = await Course.create({ title, slug, price, overview, description, sections });
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

const getCourse = async (req, res) => {
  try {
    const { slug } = req.params; // Lấy slug từ URL (vd: luyen-thi-vstep-b1)

    const course = await Course.findOne({ slug });
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học!' });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;

    const course = await Course.findOneAndUpdate({ slug }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học để cập nhật.' });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOneAndDelete({ slug });

    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học để xóa.' });
    }

    return res.status(200).json({ message: 'Xóa khóa học thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

const getLesson = async (req, res) => {
  try {
    const { courseSlug, lessonSlug } = req.params;
    console.log('Received courseSlug:', courseSlug);
    console.log('Received lessonSlug:', lessonSlug);

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ message: 'Không tìm thấy khóa học!' });
    }

    // Tìm lesson trong sections
    let lesson = null;
    let sectionTitle = '';
    console.log('Searching for lessonSlug:', lessonSlug);
    console.log('Course sections:', course.sections.map(s => ({
      sectionTitle: s.sectionTitle,
      lessons: s.lessons.map(l => ({ title: l.title, slug: l.slug }))
    })));
    
    for (const section of course.sections) {
      // Ưu tiên tìm theo slug, nếu không có thì tìm theo title match
      lesson = section.lessons.find(l => 
        l.slug === lessonSlug || 
        l.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === lessonSlug
      );
      if (lesson) {
        sectionTitle = section.sectionTitle;
        console.log('Found lesson:', lesson.title, 'in section:', sectionTitle);
        break;
      }
    }

    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học!' });
    }

    // Tạo videoUrl từ videoType và videoId
    let videoUrl = '';
    if (lesson.videoType === 'youtube') {
      videoUrl = `https://www.youtube.com/embed/${lesson.videoId}`;
    } else if (lesson.videoType === 'vimeo') {
      videoUrl = `https://vimeo.com/${lesson.videoId}`;
    }

    const lessonData = {
      title: lesson.title,
      subtitle: lesson.subtitle,
      videoUrl,
      duration: lesson.duration,
      isFree: lesson.isFree,
      sectionTitle,
      courseTitle: course.title
    };

    return res.status(200).json(lessonData);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi Server', error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getLesson,
};