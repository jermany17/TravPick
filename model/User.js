const mongoose = require("mongoose"); // mongoDB 사용
const bcrypt = require("bcryptjs"); // 비밀번호 해싱

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
}, { versionKey: false });

// 비밀번호 변경 시 자동 해싱(회원가입 포함)
UserSchema.pre("save", async function (next) {
    if (!this.isModified("userPassword")) return next();
    this.userPassword = await bcrypt.hash(this.userPassword, 10);
    next();
});

const User = mongoose.model("User", UserSchema); // users 라는 이름으로 테이블 생성 
module.exports = User;
