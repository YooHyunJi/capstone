// 로그인
// Author : Sumin, Created : 21.10.09

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var crypto = require('crypto');
var connection = config.init();
connection.connect();

router.post('/login', function (req, res) {
    var storeId = req.body.storeId; // 아이디
    var storePw = req.body.storePw;  // 비밀번호
    var query = 'SELECT * FROM store WHERE storeId = ?'; // 로그인 쿼리문
    var salt = ''

    // 해당 ID가 있는지 확인 -> 있으면 salt값 가져옴
    connection.query(query, storeId, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({"code": 404, "result": "error occured"});
        } else {
            if (result.length == 0) { // ID가 다를 경우
                res.json({"code": 204, "result": "ID or password is not correct"});
            } else { // ID가 있는 경우
                salt = result[0].salt;
            }
        }
    })

    connection.query(query, storeId, function (err, result) {
        var message = 'error';

        if (err) { // 에러 발생시
            console.log(err);
            res.json({'code': 404, 'message': message});
        } else {
            crypto.pbkdf2(storePw, salt, 100, 64, 'sha512', (err, key) => {
                var hashPw = key.toString('base64');

                if (hashPw != result[0].storePw) { //password가 다를 경우
                    message = 'Password is not correct';
                    res.json({'code': 208, 'message': message});
                } else {  //로그인에 성공했을 경우
                    message = 'login success. Welcome ' + result[0].storeName;
                    res.json({'code': 200, 'name': result[0].storeName, 'message': message});
                }
            })
        }
    })
});

module.exports = router;