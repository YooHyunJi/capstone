// 카테고리 등록
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/addCategory', function (req, res) {
    var categoryName = req.body.categoryName; // 카테고리명
    var query = `INSERT INTO category (categoryName, storeNo) VALUES(?,${req.session.user.storeNo})`; // 카테고리 등록 쿼리문

    // DB에 카테고리 등록
    connection.query(query, categoryName, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("add category success");
            res.json({"code": 200, "result": "add category success"})
        }
    })

});

module.exports = router;