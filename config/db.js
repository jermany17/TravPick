const mongoose = require("mongoose"); // mongoDB 사용
require("dotenv").config(); // env 파일에 있는 환경변수 사용

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB); // DB 연결
        console.log("MongoDB 연결 성공");
    } catch (error) {
        console.error("MongoDB 연결 실패:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
