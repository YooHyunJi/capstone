// 주문취소
// Author : Sumin, Created : 2021.10.10

var express = require('express');
var router = express.Router();
var config = require('../config/db_config');
var connection = config.init();
connection.connect();

router.post('/cancelOrder', function (req, res) {
    var orderNo = req.body.orderNo; // 주문 번호
    var query = "UPDATE orders SET cancelYn = 'y' WHERE orderNo = ?"; // 주문취소 쿼리문

    // DB에서 주문 상태변경 n->y
    connection.query(query, orderNo, function (error, result) {
        if(error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("cancel order success");
            res.json({"code": 200, "result": "cancel order success"})
        }
    })

});

module.exports = router;