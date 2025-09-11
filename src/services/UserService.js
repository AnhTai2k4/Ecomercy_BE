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

    
  } catch (e) {
    throw e;
  }
};

const updateUser = async ({ id, data }) => {
  try {
    // Kiểm tra email tồn tại
    const isCheck = await User.findOne({ _id: id });
    if (!isCheck) {
      return {
        success: false,
        message: "Khong ton tai user",
      };
    }

    const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
    return {
      success: true,
      data: updateUser,
    };
  } catch (e) {
    throw e;
  }
};

const deleteUser = async (id) => {
  try {
    // Kiểm tra email tồn tại
    const isCheck = await User.findOne({ _id: id });
    if (!isCheck) {
      return {
        success: false,
        message: "Khong ton tai user",
      };
    }

    const deleteUser = await User.findByIdAndDelete(id);
    return {
      success: true,
      data: deleteUser,
    };
  } catch (e) {
    throw e;
  }
};

const getAllUser = async () => {
  try {
    // Kiểm tra email tồn tại
    const allUser = await User.find();
    if (!allUser) {
      return {
        success: false,
        message: "Khong co du lieu all user",
      };
    }

    return {
      success: true,
      data: allUser,
    };
  } catch (e) {
    throw e;
  }
};

const getUser = async (id) => {
  try {
    console.log(id)
    // Kiểm tra email tồn tại
    const user = await User.findOne({ _id: id });
    console.log(user)
    if (!user) {
      return {
        success: false,
        message: "Khong ton tai user",
      };
    }
    return {
      success: true,
      data: user,
    };
  } catch (e) {
    throw e;
  }

};



module.exports = { createUser, signinUser, updateUser,deleteUser,getAllUser,getUser };
