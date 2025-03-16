const Post = require("../model/Post");
const User = require("../model/User");

// 게시물 생성 API (POST /post/create)
exports.createPost = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(400).json({ message: "사용자를 찾을 수 없습니다." });
        }

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

// 좋아요 추가/취소 API (POST /post/:id/like)
exports.toggleLike = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }

        const { id } = req.params;
        const userId = req.session.user.id;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });
        }

        // 좋아요 상태 확인
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex === -1) {
            // 좋아요 추가
            post.likes.push(userId);
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
