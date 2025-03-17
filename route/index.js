const express = require("express");
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware2');

router.get("/", (req, res) => {
    res.render("home");  // home.ejs 렌더링
});

router.get("/loginpage", (req, res) => {
    res.render("loginpage");  // 로그인 페이지
});

router.get("/signuppage", (req, res) => {
    res.render("signuppage");  // 회원가입 페이지
});

router.get("/signuppage2", (req, res) => {
    res.render("signuppage2"); // 회원가입 완료 페이지
});

router.get("/mypage", isAuthenticated, (req, res) => {
    res.render("mypage"); // 내 정보 페이지
});

router.get("/updatepasswordpage", isAuthenticated, (req, res) => {
    res.render("updatepasswordpage"); // 내 정보 페이지
});

router.get("/countrypage/:countryName", (req, res) => {
    const countryName = req.params.countryName;
    res.render("countrypage", { countryName }); // 나라별 페이지
});

router.get('/countrypage/:country/:category', (req, res) => {
    const countryName = req.params.country;
    const category = decodeURIComponent(req.params.category); // 디코딩 처리
    
    if (category === "가볼 만한 곳") {
        res.render('placepage', { countryName });
    } else if (category === "식당 & 카페") {
        res.render('restaurantpage', { countryName });
    } else if (category === "교통") {
        res.render('trafficpage', { countryName });
    } else {
        res.status(404).send("페이지를 찾을 수 없습니다.");
    }
});

router.get('/countrypage/:country/:type/addpost', isAuthenticated, (req, res) => {
    const countryName = req.params.country;
    const postType = req.params.type; // 고정된 type 값
    res.render('addpost', { countryName, postType });
});

router.get("/postpage/:postid", (req, res) => { // 게시물
    const postid = req.params.postid;
    res.render("postpage", { postId: postid }); 
});
module.exports = router;
