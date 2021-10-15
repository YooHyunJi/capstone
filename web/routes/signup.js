// 회원가입
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var crypto = require('crypto');
var connection = config.init();
connection.connect();
var moment = require('moment');

router.post('/signup', function(req, res) {
    var storeId = req.body.storeId; // 아이디
    var storeName = req.body.storeName; // 매장 이름
    var storePw = ''; // 비밀번호
    var salt = ''; // 암호화에 필요한 요소
    var storeTel = req.body.storeTel; // 매장 연락처
    var storeLoc = req.body.storeLoc; // 위치
    var crn = req.body.crn; // 사업자번호
    var managerName = req.body.managerName // 관리자 이름
    var managerTel = req.body.managerTel // 관리자 연락처
    var regDate = moment().format("YYYY-MM-DD hh:mm:ss"); // 가입 날짜, 시간
    
    var query = 'INSERT INTO store (storeId, storeName, storePw, salt, storeTel, storeLoc, crn, managerName, managerTel, regDate) VALUES (?,?,?,?,?,?,?,?,?,?)'; // 회원가입 쿼리문

    // 아이디 중복 확인
    connection.query('SELECT storeId FROM store WHERE storeId = ?', storeId, function (error, result) {
        if(result.length == 0) { // 중복된 아이디가 없을 경우
            // 비밀번호 암호화한 후 DB에 저장
            if(error) { // 에러 발생시
                console.log("error ocurred: ", error);
                res.json({"code" : 400, "result": "error ocurred"});
            } else {
                // salt 값 랜덤 생성
                crypto.randomBytes(64, (err, buf) => { 
                    salt = buf.toString('base64');
                    // 비밀번호 암호화
                    crypto.pbkdf2(req.body.storePw, salt, 100, 64, 'sha512', (err, key) => {
                        storePw = key.toString('base64');
                        // user정보 DB에 저장
                        connection.query(query, [storeId, storeName, storePw, salt, storeTel, storeLoc, crn, managerName, managerTel, regDate], function (error, result) {
                            if (error) { // 에러 발생시
                                console.log("error ocurred: ", error);
                                res.json({ "code" : 400, "result": "error ocurred" })
                            } else { // 회원가입 성공시
                                console.log("signup success");
                                res.json({ "code": 200, "result": "signup success" });
                            }
                        }); 
                    })
                })
            }
        } else { // 중복된 아이디일 경우
            console.log("duplicated id");
            res.json({"code" : 204, "result": "duplicated id"});
        }
    }); 
});

module.exports = router;