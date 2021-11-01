// 카테고리별 메뉴 조회
// Author : Sumin, Created : 2021.10.15

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/getMenusByCategory', function (req, res) {
    var categoryName = req.body.categoryName; // 카테고리 번호
    var query = 'SELECT menuNo, categoryName, menuName, menuPrice, menuDetail FROM category, menu WHERE category.categoryName = ? AND menu.categoryNo = category.categoryNo'; // 카테고리별 메뉴 조회 쿼리문

    // DB에서 조회
    connection.query(query, categoryName, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get menus by category success");
            res.json({"code": 200, "result": "get menus by category success", "menus": result})
        }
    })

});

module.exports = router;