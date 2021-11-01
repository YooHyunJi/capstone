// 회원정보 수정
// Author : Sumin, Created : 2021.10.31

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var crypto = require('crypto');
var connection = config.init();
connection.connect();

router.get('/getUserInfo', function (req, res) {
    var query = `SELECT storeName, storeTel, storeLoc, crn, managerName, managerTel FROM store WHERE storeNo=${req.session.user.storeNo}`; // 메뉴 수정 쿼리문

    // DB에서 메뉴 정보 수정
    connection.query(query, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get userinfo success");
            res.json({"code": 200, "result": "get userinfo success", "userInfo": result})
        }
    })

});


router.post('/updateUserInfo', function (req, res) {
    var storePw = ''; // 비밀번호
    var salt = ''; // 비밀번호 암호화 요소
    var storeName = req.body.storeName; // 매장명
    var storeTel = req.body.storeTel; // 매장 연락처
    var storeLoc = req.body.storeLoc; // 매장 주소
    var crn = req.body.crn; // 사업자등록번호
    var managerName = req.body.managerName; // 매니저명
    var managerTel = req.body.managerTel; // 매니저 연락처
    var query = `UPDATE store SET storePw = ?, salt = ?, storeName = ?, storeTel = ?, storeLoc = ?, crn = ?, managerName = ?, managerTel = ? WHERE storeNo = 6`; // 회원정보수정 쿼리문

     // salt 값 랜덤 생성
     crypto.randomBytes(64, (err, buf) => { 
        salt = buf.toString('base64');
        // 비밀번호 암호화
        crypto.pbkdf2(req.body.storePw, salt, 100, 64, 'sha512', (err, key) => {
            storePw = key.toString('base64');

            // DB에서 회원정보수정
            connection.query(query, [storePw, salt, storeName, storeTel, storeLoc, crn, managerName, managerTel], function (err, result) {
                if(err) { // 에러 발생시
                    console.log("error ocurred: ", err);
                    res.json({ "code": 400, "result": "error ocurred" })
                } else {
                    console.log("update userinfo success");
                    res.json({"code": 200, "result": "update userinfo success"})
                }
            })
        })
    })
});

module.exports = router;