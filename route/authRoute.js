const express = require("express"); // 서버 구성
const { checkUserId, signup, login, logout, checkLogin, getUserInfo, checkPassword, updatePassword, deleteUser } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/check-userid", checkUserId);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-login", checkLogin);
router.get("/userinfo", authMiddleware, getUserInfo);
router.post("/check-password", authMiddleware, checkPassword);
router.put("/update-password", authMiddleware, updatePassword);
router.delete("/delete-account", authMiddleware, deleteUser);

module.exports = router;
