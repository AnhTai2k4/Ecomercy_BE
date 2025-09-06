
const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
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

const signinUser = async (req, res) => {
  try {
    const { email, password} = req.body;

    // validate input
    if (!email || !password ) {
      return res.status(400).json({
        success: false,
        message: "Thiếu dữ liệu đầu vào"
      });
    }
  

    // gọi service
    const result = await UserService.signinUser({ email, password});

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Dang nhap user thành công",
      data: result.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    // gọi service
    const result = await UserService.updateUser({id,data});

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Update user thành công",
      data: result.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const token= req.headers.token.split(" ")[1];
    console.log("id bi xoa ne",id)
    console.log("token ne",token)
    
   

    //gọi service
    const result = await UserService.deleteUser(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Delete user thành công",
      data: result.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
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
        message: result.message
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Nhan all user thành công",
      data: result.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
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
        message: result.message
      });
    }

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Nhan user thành công",
      data: result.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

const refreshToken = async (req, res) => {
  try {

    const token = req.headers.token.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token la bat buoc"
      });
    }

    const result = await JwtService.refreshTokenService(token);

    // ✅ trả về model vừa tạo
    return res.status(201).json({
      success: true,
      message: "Nhan user thành công",
      data: result.data
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message
    });
  }
};




module.exports = { createUser, signinUser, updateUser,deleteUser, getAllUser, getUser,refreshToken };
