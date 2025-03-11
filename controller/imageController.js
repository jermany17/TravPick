const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer"); // 파일 업로드 미들웨어
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // 파일명 랜덤생성
const dotenv = require("dotenv");
dotenv.config(); // 환경 변수 로드


// S3 클라이언트 설정 (v3 방식)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 버킷 및 저장 경로 설정
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const basePath = process.env.AWS_S3_BASE_PATH;

// Multer 설정 (메모리 저장)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB 제한
});

// 이미지 업로드 API (POST /s3/upload)
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "파일이 없습니다." });
        }

        // 파일명 생성
        const fileName = `${basePath}/${uuidv4()}_${path.basename(req.file.originalname)}`;

        // S3 업로드
        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ACL: "public-read", // 공개 읽기 설정
        };

        await s3.send(new PutObjectCommand(uploadParams));

        res.json({ imageUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}` });
    } catch (error) {
        console.error("파일 업로드 오류:", error);
        res.status(500).json({ message: "파일 업로드 실패" });
    }
};

// 이미지 삭제 API (DELETE /s3/delete)
exports.deleteImage = async (req, res) => {
    try {
        const { fileUrl } = req.query;
        if (!fileUrl) {
            return res.status(400).json({ message: "삭제할 파일의 URL을 입력해주세요." });
        }

        // S3 키 추출 (버킷 URL 제거)
        const fileKey = fileUrl.replace(`https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`, "");

        // S3 삭제 요청
        await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: fileKey }));

        res.json({ message: "파일 삭제 완료", deletedFileUrl: fileUrl });
    } catch (error) {
        console.error("파일 삭제 오류:", error);
        res.status(500).json({ message: "파일 삭제 실패" });
    }
};

// Multer 미들웨어 (업로드 요청 처리)
exports.uploadMiddleware = upload.single("file"); // 단일 파일 업로드
