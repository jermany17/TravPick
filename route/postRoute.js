const express = require("express");
const { createPost, getPost, getPostList, toggleLike, getLikeCount } = require("../controller/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/post/create", authMiddleware, createPost); // 게시물 생성
router.get("/post/:id", getPost); // 게시물 단일 조회
router.get("/post/list", getPostList); // 게시물 목록 조회
router.post("/post/:id/like", authMiddleware, toggleLike); // 게시물 좋아요 추가/취소
router.get("/post/:id/like", getLikeCount); // 좋아요 개수 조회

module.exports = router;
