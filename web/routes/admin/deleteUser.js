// 회원탈퇴
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var crypto = require('crypto');
var connection = config.init();
connection.connect();

router.post('/deleteUser', function (req, res) {
    var storePw = req.body.storePw; // 비밀번호
    var query = `SELECT storePw, salt FROM store WHERE storeNo = ${req.session.user.storeNo}`;

    connection.query(query, function (err, result) {
        var salt = result[0].salt;
        if (err) { // 에러 발생시
            console.log(err);
            res.json({'code': 404});
        } else {
            crypto.pbkdf2(storePw, salt, 100, 64, 'sha512', (err, key) => {
                var hashPw = key.toString('base64');
                if (hashPw != result[0].storePw) { // password가 다를 경우
                    res.json({'code': 208, 'result': 'Password is not correct'});
                }
                else { // password 옳게 입력한 경우 회원탈퇴 진행
                    res.json({'code': 200, 'result': 'Password is correct'});
                }
            })
        }
    })

    // DB 에서 사용자 정보 삭제
    /*query = `DELETE FROM store WHERE storeId = ${req.session.user.storeId}` // 회원탈퇴 쿼리문
    connection.query(query, storeId, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("delete user success");
            res.json({"code": 200, "result": "delete user success"})
        }
    })*/

});

module.exports = router;