// 준비완료 상태변경
// Author: Sumin, Created: 2021.11.03

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/changeOrderStatus', function (req, res) {
    var orderNo = req.body.orderNo; // 주문 번호

    var query = "UPDATE orders SET orderStatus = 1 WHERE orderNo = ?";
    connection.query(query, orderNo, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("change order status success");
            res.json({"code": 200, "result": "change order status success"})
        }
    })
});

module.exports = router;