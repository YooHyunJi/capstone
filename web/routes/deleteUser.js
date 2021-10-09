// 회원탈퇴
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var connection = config.init();
connection.connect();

router.post('/deleteUser', function (req, res) {
    var storeId = req.body.storeId; // 아이디
    var query = 'DELETE FROM store WHERE storeId = ?' // 회원탈퇴 쿼리문

    // DB 에서 사용자 정보 삭제
    connection.query(query, storeId, function (error, result) {
        if(error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("delete user success");
            res.json({"code": 200, "result": "delete user success"})
        }
    })

});

module.exports = router;