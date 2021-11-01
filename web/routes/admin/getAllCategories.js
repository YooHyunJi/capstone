// 전체 카테고리 조회
// Author : Sumin, Created : 2021.10.15

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.get('/getAllCategories', function (req, res) {
    var query = `SELECT categoryNo, categoryName FROM category WHERE storeNo = ${req.session.user.storeNo}`; // 카테고리 조회 쿼리문

    // DB에서 조회
    connection.query(query, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get categories success");
            res.json({"code": 200, "result": "get categories success", "categories": result})
        }
    })

});

module.exports = router;