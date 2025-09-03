const User = require("../models/UserModel");

const createUser = (props) => {
  return new Promise((resolve, reject) => {
    try {
      const { name, email, password, confirmPassword, phone } = props;
      User.create({
        name,
        email,
        password,
        confirmPassword,
        phone,
      });
      resolve((req, res) => {
        return res.json({
          name,
          email,
          password,
          confirmPassword,
          phone,
        });
      });
    } catch (e) {
      reject(console.log("Loi gi do: ",e));
    }
  });
};

module.exports = {
  createUser,
};
