const UserService = require('../services/UserService');

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // validate input
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu đầu vào"
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password không trùng confirmPassword"
      });
    }

    // gọi service
    const result = await UserService.createUser({ name, email, password, confirmPassword, phone });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Tạo user thành công",
      data: result.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

module.exports = { createUser };
