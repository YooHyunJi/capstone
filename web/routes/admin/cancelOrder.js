// 주문취소
// Author : Sumin, Created : 2021.10.10, Last modified : 2021.10.13

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();
var moment = require('moment');

router.post('/cancelOrder', function (req, res) {
    var storeNo = req.session.user.storeNo; // 매장 번호
    var orderNo = req.body.orderNo; // 주문 번호
    var paymentType = "주문취소"; // 결제 타입(주문결제/주문취소)

    var query = "SELECT paymentMethod, paymentPrice FROM payment WHERE orderNo = ?";
    connection.query(query, orderNo, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("select payment table success");
            
            var paymentTime = moment().format("YYYY-MM-DD hh:mm:ss"); // 결제 취소 완료 시간
            var paymentMethod = result[0].paymentMethod; // 결제 수단(현금/카드)
            var paymentPrice = result[0].paymentPrice; // 결제 가격(=취소될 금액)

            query = "UPDATE orders SET cancelYn = 'Y' WHERE orderNo = ?;" + // 주문상태 변경
                "INSERT INTO payment (paymentType, paymentTime, paymentMethod, paymentPrice, storeNo, orderNo) VALUES(?,?,?,?,?,?)" // payment테이블에 결제취소 정보 삽입

            // DB에 주문 상태변경 및 결제 취소 정보 추가
            connection.query(query, [orderNo, paymentType, paymentTime, paymentMethod, paymentPrice, storeNo, orderNo], function (err, result) {
                if(err) { // 에러 발생시
                    console.log("error ocurred: ", err);
                    res.json({ "code": 400, "result": "error ocurred" })
                } else {
                    console.log("cancel order success");
                    res.json({"code": 200, "result": "cancel order success"})
                }
            })
        }
    })

});

module.exports = router;