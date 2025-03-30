const express = require("express");
const { createPost, getPost, getPostList, getPostListByLikes, deletePost, toggleLike, getLikeCount, updatePost, addComment, deleteComment, getMyPosts } = require("../controller/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/post/create", authMiddleware, createPost); // 게시물 생성
router.get("/post/list", getPostList); // 최신순 게시물 목록 조회
router.get("/post/list/likes", getPostListByLikes); // 좋아요 순 게시물 목록 조회
router.get("/post/:id", getPost); // 게시물 단일 조회

router.get("/post/my/posts", authMiddleware, getMyPosts); // 내가 쓴 게시물 조회
router.delete("/post/:id", authMiddleware, deletePost); // 게시물 삭제
router.patch("/post/:id", authMiddleware, updatePost); // 게시물 수정

router.post("/post/:id/:userName/like", authMiddleware, toggleLike); // 게시물 좋아요 추가/취소
router.get("/post/:id/like", getLikeCount); // 좋아요 개수 조회

router.post("/post/:id/comment", authMiddleware, addComment); // 댓글 작성
router.delete("/post/:postId/comment/:commentId", authMiddleware, deleteComment); // 댓글 삭제

module.exports = router;
