const Post = require("../model/Post");
const User = require("../model/User");

// 게시물 생성 API (POST /post/create)
exports.createPost = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);

        const { title, contents, country, classify } = req.body; // 정렬된 텍스트 및 이미지 URL 배열

        if (!contents || !Array.isArray(contents) || contents.length === 0) {
            return res.status(400).json({ message: "게시물 내용을 입력해주세요." });
        }

        const newPost = await Post.create({
            title,
            userName: user.userName,
            userId: user.userId,
            country,
            classify,
            contents,
        });

        res.status(201).json({ message: "게시물 등록 완료", postId: newPost._id });
    } catch (error) {
        console.error("게시물 생성 오류:", error);
        res.status(500).json({ message: "게시물 등록 실패" });
    }
};

// 게시물 단일 조회 API (GET /post/:id)
exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        res.json(post);
    } catch (error) {
        console.error("게시물 조회 오류:", error);
        res.status(500).json({ message: "게시물 조회 실패" });
    }
};

// 게시물 목록 조회 API (GET /post/list)
exports.getPostList = async (req, res) => {
    try {
        const { country, classify } = req.query;
        const filter = {};

        if (country) filter.country = country;
        if (classify) filter.classify = classify;

        const posts = await Post.find(filter).sort({ createAt: -1 }).lean(); // 최신순 정렬
        res.json(posts);
    } catch (error) {
        console.error("게시물 목록 조회 오류:", error);
        res.status(500).json({ message: "게시물 목록 조회 실패" });
    }
};

// 게시물 삭제 API (DELETE /post/:id)
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        await Post.deleteOne({ _id: id });

        res.json({ message: "게시물이 삭제되었습니다." });
    } catch (error) {
        console.error("게시물 삭제 오류:", error);
        res.status(500).json({ message: "게시물 삭제 실패" });
    }
};

// 게시물 수정 API (PATCH /post/:id)
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, contents } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        post.title = title;
        post.contents = contents;
        post.updateAt = Date.now();

        await post.save();

        res.json({ message: "게시물이 수정되었습니다." });
    } catch (error) {
        console.error("게시물 수정 오류:", error);
        res.status(500).json({ message: "게시물 수정 실패" });
    }
};

// 좋아요 추가/취소 API (POST /post/:id/like)
exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userName } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        // 좋아요 상태 확인
        const likeIndex = post.likes.indexOf(userName);

        if (likeIndex === -1) {
            // 좋아요 추가
            post.likes.push(userName);
        } else {
            // 좋아요 취소
            post.likes.splice(likeIndex, 1);
        }

        await post.save();

        res.json({ message: "좋아요 상태 변경 완료" });
    } catch (error) {
        console.error("좋아요 토글 오류:", error);
        res.status(500).json({ message: "좋아요 처리 실패" });
    }
};

// 좋아요 개수 조회 API (GET /post/:id/like)
exports.getLikeCount = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        res.json({ likeCount: post.likes.length });
    } catch (error) {
        console.error("좋아요 개수 조회 오류:", error);
        res.status(500).json({ message: "좋아요 개수 조회 실패" });
    }
};

// 좋아요 개수 순으로 게시물 목록 조회 API (GET /post/list/likes)
exports.getPostListByLikes = async (req, res) => {
    try {
        const { country, classify } = req.query;
        const filter = {};

        if (country) filter.country = country;
        if (classify) filter.classify = classify;

        const posts = await Post.find(filter).lean();

        // 1순위: 좋아요 수, 2순위: 최신순
        posts.sort((a, b) => {
            const likeDiff = (b.likes?.length || 0) - (a.likes?.length || 0);
            if (likeDiff !== 0) return likeDiff;

            // 날짜 비교 (최근 날짜가 앞으로 오게)
            return new Date(b.createAt) - new Date(a.createAt);
        });

        res.json(posts);
    } catch (error) {
        console.error("좋아요 수 기준 게시물 목록 조회 오류:", error);
        res.status(500).json({ message: "게시물 목록 조회 실패" });
    }
};
