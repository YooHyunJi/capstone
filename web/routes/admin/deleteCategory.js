// 카테고리 삭제
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/deleteCategory', function (req, res) {
    var categoryNo = req.body.categoryNo; // 카테고리 번호
    var query = 'DELETE FROM category WHERE categoryNo = ?'; // 카테고리 삭제 쿼리문

    // DB에서 카테고리 삭제
    connection.query(query, categoryNo, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("delete category success");
            res.json({"code": 200, "result": "delete category success"})
        }
    })

});

module.exports = router;