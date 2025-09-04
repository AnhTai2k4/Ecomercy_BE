const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("./JwtService");

const createUser = async ({
  name,
  email,
  password,
  confirmPassword,
  phone,
}) => {
  try {
    // Kiểm tra email tồn tại
    const isCheck = await User.findOne({ email });
    if (isCheck) {
      return {
        success: false,
        message: "Email đã tồn tại",
      };
    }

    const hashPassword = bcrypt.hashSync(password, 10);

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
      data: newUser,
    };
  } catch (e) {
    throw e;
  }
};

const signinUser = async ({ email, password }) => {
  try {
    // Kiểm tra email tồn tại
    const isCheck = await User.findOne({ email });
    if (!isCheck) {
      return {
        success: false,
        message: "Emai khong hop le",
      };
    }

    const comparePassword = await bcrypt.compare(password, isCheck.password);
    console.log(comparePassword);
    if (comparePassword) {
      const Access_token = await createAccessToken({
        id: isCheck._id,
        isAdmin: isCheck.isAdmin,
      });
      const Refresh_token = await createRefreshToken({
        id: isCheck._id,
        isAdmin: isCheck.isAdmin,
      });
      return {
        success: true,
        data: { Access_token, Refresh_token },
      };
    } else {
      return {
        success: false,
        message: "Mat khau khong hop le",
      };
    }

    // // Tạo user mới
    // const newUser = await User.create({
    //   name,
    //   email,
    //   password: hashPassword,
    //   confirmPassword,
    //   phone,
    // });
  } catch (e) {
    throw e;
  }
};

module.exports = { createUser, signinUser };
