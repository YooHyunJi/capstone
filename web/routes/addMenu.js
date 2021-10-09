// 메뉴 등록
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var connection = config.init();
connection.connect();

router.post('/addMenu', function (req, res) {
    var menuName = req.body.menuName; // 메뉴명
    var menuDetail = req.body.menuDetail; // 메뉴 세부사항
    var menuPrice = req.body.menuPrice; // 메뉴 가격
    var categoryNo = req.body.categoryNo; // 카테고리 번호
    var storeNo = req.body.storeNo; // 가게 번호
    var query = 'INSERT INTO menu (menuName, menuDetail, menuPrice, categoryNo, storeNo) VALUES(?,?,?,?,?)'; // 카테고리 등록 쿼리문

    // DB에 메뉴 등록
    connection.query(query, [menuName, menuDetail, menuPrice, categoryNo, storeNo], function (error, result) {
        if(error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("add menu success");
            res.json({"code": 200, "result": "add menu success"})
        }
    })

});

module.exports = router;