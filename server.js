const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const { sessionMiddleware, corsMiddleware } = require("./config/sessionConfig");
const authRoutes = require("./route/authRoute");
const imageRoutes = require('./route/imageRoute');

require("dotenv").config();

const app = express();
connectDB();

// 미들웨어 설정
app.use(corsMiddleware);
app.use(sessionMiddleware);
app.use(express.json());

// EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 정적 파일 제공 (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// 라우트 설정
app.use(authRoutes);
app.use(imageRoutes);
app.use("/", require("./route/index"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
