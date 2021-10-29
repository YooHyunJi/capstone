// 아이디 찾기
// Author : Sumin, Created : 21.10.10, Last modified : 2021.10.13

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/findid', function (req, res) {
    var crn = req.body.crn; // 사업자번호
    var managerTel = req.body.managerTel; // 매니저 연락처
    var query = 'SELECT storeId FROM store WHERE crn = ? AND managerTel = ?'; // 아이디찾기 쿼리문

    connection.query(query, [crn, managerTel], function(err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({"code": 404, "result": 'error occured'});
        } else {
            if (result.length == 0) {   // 가입하지 않은 사용자인 경우
                res.json({"code": 204, "result": "never registered"});
            } else { // ID를 찾은 경우
                res.json({"code": 200, "storeId": result[0].storeId});
            }
        }
    })
});

module.exports = router; 