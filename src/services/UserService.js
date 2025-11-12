const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { createAccessToken, createRefreshToken } = require("./JwtService");

const createUser = async ({
  name,
  username,
  password,
  confirmPassword,
  phone,
}) => {
  try {
    // Kiểm tra username tồn tại
    const isCheck = await User.findOne({ username });
    if (isCheck) {
      return {
        success: false,
        message: "Username đã tồn tại",
      };
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    // Tạo user mới
    const newUser = await User.create({
      name,
      username,
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

const signinUser = async ({ username, password }) => {
  try {
    // Kiểm tra username tồn tại
    const isCheck = await User.findOne({ username });
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

const registOption = async (username) => {
  const user = await User.findOne({ username });
  if (user) {
    return {
      status: false,
      message: "Username đã tồn tại",
    };
  }

  const challenge = Buffer.from(Math.floor.toString(36)).toString("base64");

  const option = {
    challenge: challenge,
    rp: {
      name: "WebAuthn",
      id: "localhost",
    },
    user: {
      id: Buffer.from(username.toString(36)).toString("base64"),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "preferred",
      userVerification: "preferred",
    },
    timeout: 60000,
    attestation: "none",
  };

  if (option) console.log(`tao thanh cong option cho ${username}: `, option);
  return {
    status: true,
    message: "Tao thanh cong option",
    data: option,
  };
};

const addRegister = async (username) => {
  const user = await User.findOne({ username });

  const challenge = Buffer.from(Math.floor.toString(36)).toString("base64");

  const option = {
    challenge: challenge,
    rp: {
      name: "WebAuthn",
      id: "localhost",
    },
    user: {
      id: Buffer.from(username.toString(36)).toString("base64"),
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      { type: "public-key", alg: -257 },
    ],
    authenticatorSelection: {
      authenticatorAttachment: "preferred",
      userVerification: "preferred",
    },
    timeout: 60000,
    attestation: "none",
  };

  if (option) console.log(`tao thanh cong option cho ${username}: `, option);
  return {
    status: true,
    message: "Tao thanh cong option",
    data: option,
  };
};

const registVerify = async ({ username, attResp }) => {
  try {
    if (attResp && attResp.id) {
      const credential = {
        id: attResp.id,
        createdAt: new Date(),
      };

      const user = User.create({
        username,
        credential,
        createdAt: new Date(),
      });
      return {
        status: true,
        message: "Verify dang ký thanh cong",
        credential: credential,
      };
    }
  } catch (err) {
    console.log("Verify option đăng ký lỗi: ", err.message);
    throw err;
  }
};

const addVerify = async ({ username, attResp }) => {
  try {
    console.log("Verify login for", username);
    const user = await User.findOne({ username });

    if (!user) {
      console.log("Không tìm thấy user:", username);
      return {
        status: false,
        message: "Không tìm thấy người dùng để lưu credential.",
      };
    }

    if (attResp && attResp.id) {
      user.credential = {
        id: attResp.id,
        createAt: new Date(),
      };
      await user.save();

      console.log("Lưu credential thành công cho", username);
    }

    return {
      status: true,
      message: "Verify đăng ký thành công",
      data: user.credential,
    };
  } catch (err) {
    console.log("Verify option đăng ký lỗi:", err.message);
    throw err;
  }
};

const loginOption = async (username) => {
  try {
    const user = await User.findOne({ username });

    if (!user?.credential?.id) {
      return res.status(400).json({ error: "User chua dang ky" });
    }

    const challenge = Buffer.from(Math.random().toString(36)).toString(
      "base64"
    );
    
    
    const options = {
      challenge: challenge,
      allowCredentials: [
        {
          id: user.credential.id,
          type: "public-key",
        },
        
      ],
      timeout: 60000,
      userVerification: "preferred",
    };

    user.challenge = options.challenge;
    await user.save();

    console.log("Tao thanh cong option cho", username);
    return options;
  } catch (error) {
    console.error("Error in OptionLogin:", error);
    throw error;
  }
};
const loginVerify = async ({ username, authResp }) => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User khong ton tai");
    }

    if (authResp && authResp.id) {
      //Cap nhat thong tin dang nhap
      user.lastLoginAt = new Date();
      user.loginCount += 1;
      user.challenge = null; //Xoa challenge dang nhap sau khi da verify`
      await user.save();
      console.log("Verify thanh cong cho", username);

      const access_token = await createAccessToken({
        id: user.id,
        isAdmin: user.isAdmin,
      });
      console.log("access_token", access_token);

      return {
        status: "success",
        access_token,
      };
    }
  } catch (error) {
    console.error("Error in VerifyLogin:", error);
    throw error;
  }
};

const updateUser = async ({ id, data }) => {
  try {
    // Kiểm tra username tồn tại
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
    // Kiểm tra username tồn tại
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
    // Kiểm tra username tồn tại
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
    console.log(id);
    // Kiểm tra username tồn tại
    const user = await User.findOne({ _id: id });
    console.log(user);
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

module.exports = {
  createUser,
  signinUser,
  registOption,
  addRegister,
  addVerify,
  registVerify,
  loginOption,
  loginVerify,
  updateUser,
  deleteUser,
  getAllUser,
  getUser,
};
