const User = require("../model/User");
const bcrypt = require("bcryptjs"); // 비밀번호 해싱

// userId 중복 확인 API
exports.checkUserId = async (req, res) => {
    const { userId } = req.query; // 쿼리 데이터 추출
    if (!userId) return res.status(400).json({ message: "아이디를 입력해주세요." });

    const exists = await User.findOne({ userId }); // 존재 여부
    if (exists) return res.status(400).json({ message: "이미 사용 중인 아이디입니다." });

    res.json({ message: "사용 가능한 아이디입니다." }); // 200
};

// 회원 가입 API
exports.signup = async (req, res) => {
    try {
        const { nickName, userId, userPassword } = req.body; // 데이터 추출
        const user = await User.create({ nickName, userId, userPassword }); // 생성(해싱은 User에서)
        res.status(201).json({ message: "회원가입이 완료되었습니다." });
    } catch (error) {
        res.status(400).json({ message: "회원가입 실패" });
    }
};

// 로그인 API
exports.login = async (req, res) => {
    const { userId, userPassword } = req.body; // 데이터 추출
    const user = await User.findOne({ userId }); // 존재 여부

    if (!user) {
        return res.status(401).json({ message: "존재하지 않는 아이디입니다." });
    }
    if (!(await bcrypt.compare(userPassword, user.userPassword))) {
        return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
    }

    req.session.user = { id: user._id, userId: user.userId }; // 로그인된 사용자 정보 세션에 저장
    res.json({ message: "로그인 성공" }); // 200
};

// 로그아웃 API
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid"); // 세션 쿠키 삭제
        res.json({ message: "로그아웃 성공." }); // 200
    });
};

// 로그인 여부 확인 API
exports.checkLogin = (req, res) => {
    if (!req.session.user) return res.status(401).json({ isLoggedIn: false, message: "로그인되지 않은 사용자입니다." });
    res.json({ isLoggedIn: true, message: "로그인된 사용자입니다." }); // 200
};

// 사용자 정보 조회 API
exports.getUserInfo = async (req, res) => {
    const user = await User.findById(req.session.user.id).select("-userPassword"); // 비밀번호 제외하고 응답
    res.json(user); // 200
};

// 비밀번호 확인 API
exports.checkPassword = async (req, res) => {
    const { currentPassword } = req.body;
    const user = await User.findById(req.session.user.id);

    // 입력된 비밀번호와 저장된 비밀번호 비교
    const isMatch = await bcrypt.compare(currentPassword, user.userPassword);
    if (!isMatch) {
        return res.status(400).json({ message: "현재 비밀번호가 일치하지 않습니다." });
    }

    res.status(200).json({ message: "현재 비밀번호가 일치합니다." });
};

// 비밀번호 변경 API
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user.id);

    if (!(await bcrypt.compare(currentPassword, user.userPassword))) {
        return res.status(400).json({ message: "현재 비밀번호가 일치하지 않습니다." });
    }

    user.userPassword = newPassword;
    await user.save(); // 변경(해싱은 User에서)
    res.json({ message: "비밀번호가 성공적으로 변경되었습니다." }); // 200
};

// 회원 삭제 API
exports.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.session.user.id);
    req.session.destroy(() => {
        res.clearCookie("connect.sid"); // 세션 쿠키 삭제
        res.json({ message: "회원 탈퇴가 완료되었습니다." }); // 200
    });
};
