// 카테고리 수정
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/updateCategory', function (req, res) {
    var categoryNo = req.body.categoryNo; // 카테고리 번호
    var categoryName = req.body.categoryName; // 카테고리명
    var query = 'UPDATE category SET categoryName = ? WHERE categoryNo = ?'; // 카테고리 수정 쿼리문

    // DB에서 카테고리 정보 수정
    connection.query(query, [categoryName, categoryNo], function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("update category success");
            res.json({"code": 200, "result": "update category success"})
        }
    })

});

module.exports = router;