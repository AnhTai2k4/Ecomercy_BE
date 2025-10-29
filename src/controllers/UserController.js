const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const cookieParser = require("cookie-parser");
const User = require("../models/UserModel");

const createUser = async (req, res) => {
  try {
    const { name, username, password, confirmPassword, phone } = req.body;

    // validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu đầu vào",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password không trùng confirmPassword",
      });
    }

    // gọi service
    const result = await UserService.createUser({
      name,
      username,
      password,
      confirmPassword,
      phone,
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Tạo user thành công",
      data: result.data,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const signinUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu đầu vào",
      });
    }

    // gọi service
    const result = await UserService.signinUser({ username, password });
    // console.log("result ne", result.data);
    const { Refresh_token, ...newResult } = result.data;
    // console.log("Refresh_token", Refresh_token);

    try {
      res.cookie("Refresh_token", Refresh_token, {
        httpOnly: true,
        secure: false, // true khi deploy lên https
        sameSite: "lax", // phải viết đúng sameSite
        path: "/",
      });
      console.log("Tao cookie thanh cong ne");
    } catch (err) {
      console.log("Khong tao duoc cookie ne", err);
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Dang nhap user thành công",
      data: newResult,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const registOption = async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);
    if (!username) {
      return res.status(400).json({
        message: "Vui long nhap username",
      });
    }
    const result = await UserService.registOption(username);

    if (result.status) return res.status(200).json({ option: result.data });
  } catch (err) {
    console.error("Error in RegistOptions:", err);
    return res.status(400).json({ message: err.message });
  }
};

const registVerify = async (req, res) => {
  const { username, attResp } = req.body;
  if (!attResp) return res.status(400).json({ message: "Trình duyệt chưa đăng ký key thành công" });
  const result = await UserService.registVerify({ username, attResp });
  if (result.status) {
    return res
      .status(200)
      .json({ verified: true, message: "Đăng ký thành công" });
  }
};

const loginOption = async (req, res) => {
  try {
    const { username } = req.body;

    const options = await UserService.loginOption(username);

    if (options) return res.status(200).json(options);
    else {
      return res
        .status(400)
        .json({ error: "Tao challenge dang nhap that bai" });
    }
  } catch (error) {
    console.error("Error in RegistOptions:", error);
    return res.status(400).json({ error: error.message });
  }
};
const loginVerify = async (req, res) => {
  try {
    const { username, authResp } = req.body;

    const result = await UserService.loginVerify(username, authResp);
    console.log(result);
    if (result.status)
      return res.json({
        verified: true,
        access_token: result.access_token,
      });
    else {
      return res.status(400).json({ error: "Xac thuc that bai" });
    }
  } catch (error) {
    console.error("Error in RegistOptions:", error);
    return res.status(400).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // gọi service
    const result = await UserService.updateUser({ id, data });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Update user thành công",
      data: result.data,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.headers.token.split(" ")[1];
    console.log("id bi xoa ne", id);
    console.log("token ne", token);

    //gọi service
    const result = await UserService.deleteUser(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Delete user thành công",
      data: result.data,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    // gọi service
    const result = await UserService.getAllUser();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Nhan all user thành công",
      data: result.data,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    // gọi service
    const result = await UserService.getUser(req.params.id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Nhan user thành công",
      data: result.data,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    console.log("req.cookie", req.cookies);
    const token = req.cookies.Refresh_token;
    console.log("token ne", token);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token la bat buoc",
      });
    }

    const result = await JwtService.refreshTokenService(token);

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Nhan user thành công",
      data: result.data,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("Refresh_token", {
      httpOnly: true,
      secure: false, // true khi deploy lên https
      sameSite: "lax", // phải viết đúng sameSite
    });
    return res.status(200).json({
      success: true,
      data: "Logout successful",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      data: e.message,
    });
  }
};

module.exports = {
  createUser,
  signinUser,
  registOption,
  registVerify,
  loginOption,
  loginVerify,
  updateUser,
  deleteUser,
  getAllUser,
  getUser,
  refreshToken,
  logoutUser,
};
