const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/AuthMiddleWare");

router.post("/sign-up", UserController.createUser);
router.post("/sign-in", UserController.signinUser);
router.post("/check-username", UserController.checkUsername);
router.post("/register/option", UserController.registOption);
router.post("/register/add", UserController.addRegister);
router.post("/register/addVerify", UserController.addVerify);

router.post("/register/verify", UserController.registVerify);
router.post("/login/option", UserController.loginOption);
router.post("/login/verify", UserController.loginVerify);
router.post("/login/verify-two-factor", UserController.loginVerifyTwoFactor);
router.post("/log-out", UserController.logoutUser);
router.put("/update/:id", UserController.updateUser);
router.delete("/delete/:id", authMiddleware, UserController.deleteUser);
router.get("/getAllUser", authMiddleware, UserController.getAllUser);
router.get("/getUser/:id", authUserMiddleware, UserController.getUser);
router.post("/refreshToken", UserController.refreshToken);

// WebAuthn credential management (multi-device)
router.get(
  "/credentials/:id",
  authUserMiddleware,
  UserController.getWebauthnCredentials
);
router.delete(
  "/credentials/:id/:credentialId",
  authUserMiddleware,
  UserController.removeWebauthnCredential
);
router.patch(
  "/credentials/:id/:credentialId",
  authUserMiddleware,
  UserController.renameWebauthnCredential
);

module.exports = router;