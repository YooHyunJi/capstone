// 메뉴 수정
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var connection = config.init();
connection.connect();

router.post('/updateMenu', function (req, res) {
    var menuNo = req.body.menuNo; // 메뉴 번호
    var menuName = req.body.menuName; // 메뉴명
    var menuDetail = req.body.menuDetail; // 메뉴 세부사항
    var menuPrice = req.body.menuPrice; // 메뉴 가격
    var categoryNo = req.body.categoryNo; // 카테고리 번호
    var query = 'UPDATE menu SET menuName = ?, menuDetail = ?, menuPrice = ?, categoryNo = ? WHERE menuNo = ?'; // 메뉴 수정 쿼리문

    // DB에서 메뉴 정보 수정
    connection.query(query, [menuName, menuDetail, menuPrice, categoryNo, menuNo], function (error, result) {
        if(error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("update menu success");
            res.json({"code": 200, "result": "update menu success"})
        }
    })

});

module.exports = router;