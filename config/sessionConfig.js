const session = require("express-session"); // 세션 관리
const cors = require("cors"); // cors 처리
require("dotenv").config(); // env 파일에 있는 환경변수 사용

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET, // 세션 암호화에 사용
    resave: false, // 세션 데이터가 변경되지 않으면 다시 저장하지 않음
    saveUninitialized: false, // 데이터가 없는 세션을 저장하지 않음
    cookie: {
        httpOnly: true,  // JavaScript로 접근 불가
        secure: true,   // HTTPS 환경에서는 true(로컬에서는 false)
        sameSite: "none", // CORS 허용(로컬에서는 "Lax")
    },
});

const corsMiddleware = cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // 요청 허용
    credentials: true, // 쿠키, 인증 정보가 서버 간에 전송될 수 있도록 함
});

module.exports = { sessionMiddleware, corsMiddleware };
