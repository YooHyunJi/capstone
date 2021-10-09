// 메뉴 삭제
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var connection = config.init();
connection.connect();

router.post('/deleteMenu', function (req, res) {
    var menuNo = req.body.menuNo; // 메뉴 번호
    var query = 'DELETE FROM menu WHERE menuNo = ?'; // 메뉴 삭제 쿼리문

    // DB에서 메뉴 삭제
    connection.query(query, menuNo, function (error, result) {
        if(error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("delete menu success");
            res.json({"code": 200, "result": "delete menu success"})
        }
    })

});

module.exports = router;