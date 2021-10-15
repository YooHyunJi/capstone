// 카테고리별 메뉴 조회
// Author : Sumin, Created : 2021.10.15

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var connection = config.init();
connection.connect();

router.post('/getMenusByCategory', function (req, res) {
    var categoryNo = req.body.categoryNo; // 카테고리 번호
    var query = 'SELECT categoryName, menuName, menuPrice FROM category, menu WHERE category.categoryNo = ? AND menu.categoryNo = category.categoryNo'; // 카테고리별 메뉴 조회 쿼리문

    // DB에서 조회
    connection.query(query, categoryNo, function (error, result) {
        if(error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get menus by category success");
            res.json({"code": 200, "result": "get menus by category success", "menus": result})
        }
    })

});

module.exports = router;