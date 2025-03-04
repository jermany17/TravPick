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

router.get('/countrypage/:country/placepage', (req, res) => {
    const countryName = req.params.country; // URL에서 국가명 가져오기
    res.render('placepage', { countryName });
});

router.get('/countrypage/:country/restaurantpage', (req, res) => {
    const countryName = req.params.country; // URL에서 국가명 가져오기
    res.render('restaurantpage', { countryName });
});

router.get('/countrypage/:country/trafficpage', (req, res) => {
    const countryName = req.params.country; // URL에서 국가명 가져오기
    res.render('trafficpage', { countryName });
});

router.get('/countrypage/:country/:type/addpost', isAuthenticated, (req, res) => {
    const countryName = req.params.country;
    const postType = req.params.type; // 고정된 type 값
    res.render('addpost', { countryName, postType });
});

module.exports = router;
