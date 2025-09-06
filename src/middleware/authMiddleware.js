const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  console.log(req.headers.token);
  const token = req.headers.token.split(" ")[1];

  jwt.verify(token, process.env.Access_token, function (err, user) {
    if (err) {
      
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ",
      });
    } else {
      console.log(user);
      const { isAdmin } = user;
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xóa user",
        });
      } else {
        next();
      }
    }
  });
};

const authUserMiddleware = (req, res, next) => {
  console.log(req.headers.token);
  const token = req.headers.token.split(" ")[1];
  console.log('token ne', token);

  jwt.verify(token, process.env.Access_token, function (err, user) {
    if (err) {
      console.log('Loi o day', err);
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ",
      });
    } else {
      console.log(user);
      const { isAdmin } = user;
      if (isAdmin || user.id == req.params.id) {
       next();
      } else {
         return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xem user",
        });
      }
    }
  });
};

module.exports = { authMiddleware, authUserMiddleware };
