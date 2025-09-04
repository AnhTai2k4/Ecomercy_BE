const User = require("../models/UserModel");
const bcrypt = require('bcrypt')

const createUser = async ({ name, email, password, confirmPassword, phone }) => {
  try {
    // Kiểm tra email tồn tại
    const isCheck = await User.findOne({ email });
    if (isCheck) {
      return {
        success: false,
        message: "Email đã tồn tại"
      };
    }

    const hashPassword = bcrypt.hashSync(password,10)

    // Tạo user mới
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      confirmPassword,
      phone,
    });

    return {
      success: true,
      data: newUser
    };
  } catch (e) {
    throw e;
  }
};

module.exports = { createUser };
