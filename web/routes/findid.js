// 아이디 찾기
// Author : Sumin, Created : 21.10.10

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var connection = config.init();
connection.connect();

router.post('/findid', function (req, res) {
    var storeName = req.body.storeName;  // 매장명
    var crn = req.body.crn; // 사업자번호
    var query = 'SELECT storeId FROM store WHERE storeName = ? AND crn = ?'; // 아이디찾기 쿼리문

    connection.query(query, [storeName, crn], function(err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({"code": 404, "result": 'error occured'});
        } else {
            if (result.length == 0) {   // 가입하지 않은 사용자인 경우
                res.json({"code": 204, "result": "never registered"});
            } else { // ID를 찾은 경우
                res.json({"code": 200, "id": result[0].storeId});
            }
        }
    })
});

module.exports = router; 