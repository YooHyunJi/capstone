// 전체 메뉴 조회
// Author : Sumin, Created : 2021.10.15

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.get('/getAllMenus', function (req, res) {
    var query = `SELECT menuNo, menuName, menuDetail, menuPrice, categoryName FROM menu, category `+
     `WHERE menu.storeNo = ${req.session.user.storeNo} AND menu.categoryNo = category.categoryNo;` // 메뉴 조회 쿼리문

    // DB에서 조회
    connection.query(query, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            res.json({"code": 200, "result": "get menus success", "menus": result})
        }
    })
});

router.get('/getAllCategoryNames', function (req, res) {
    var query = `SELECT categoryName FROM category WHERE storeNo = ${req.session.user.storeNo}`;

    // DB에서 조회
    connection.query(query, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            res.json({"code": 200, "result": "get categoryNames success", "categories": result})
        }
    })
})

module.exports = router;