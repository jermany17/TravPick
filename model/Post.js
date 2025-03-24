const mongoose = require("mongoose"); // mongoDB 사용

const CommentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    contents: { type: String, required: true },
    createAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    country: { type: String, required: true },
    classify: { type: String, required: true },
    contents: [{ type: String, required: true }], // 글/이미지 URL 순서 유지
    likes: [{ type: String }], // 좋아요 누른 사용자 ID 목록
    comments: [CommentSchema], // 댓글
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now }
}, { versionKey: false });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
