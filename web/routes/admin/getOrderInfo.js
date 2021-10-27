// 주문내역 조회
// Author : Sumin, Created : 2021.10.10

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/getOrderInfo', function (req, res) {
    var storeNo = req.session.user.storeNo; // 매장 번호
    var query = 'SELECT orderNo, orderTime, orderStatus, customerTel, totalPrice, cancelYn FROM orders WHERE storeNo = ?'; // 주문 조회 쿼리문

    // DB에서 조회
    connection.query(query, storeNo, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get order info success");
            res.json({"code": 200, "result": "get order info success", "orders": result})
        }
    })

});

module.exports = router;