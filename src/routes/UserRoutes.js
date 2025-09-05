const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { authMiddleware } = require('../middleware/AuthMiddleWare')

router.post("/sign-up", UserController.createUser)
router.post("/sign-in", UserController.signinUser)
router.put("/update/:id", UserController.updateUser)
router.delete("/delete/:id",authMiddleware, UserController.deleteUser)
router.get("/getAllUser",authMiddleware, UserController.getAllUser)
router.get("/getUser/:id", UserController.getUser)
module.exports = router