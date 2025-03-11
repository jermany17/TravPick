const express = require("express");
const { uploadImage, deleteImage, uploadMiddleware } = require("../controller/imageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/s3/upload", authMiddleware, uploadMiddleware, uploadImage);
router.delete("/s3/delete", authMiddleware, deleteImage);

module.exports = router;
