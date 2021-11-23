// 주문 관리 관련 라우터 목록
// Author : Sumin, Created : 2021.10.10, Last Modified: 2021.11.08

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();
var moment = require('moment');

// 1. 주문내역 조회 라우터
router.get('/getAllOrders', function (req, res) {
    // 주문 조회 쿼리문
    var query = `SELECT orderNo, DATE_FORMAT(orderTime, '%Y-%m-%d %H:%m:%s') AS orderTime, orderStatus, customerTel, totalPrice, cancelYn FROM orders `;
    +`WHERE storeNo = ${req.session.user.storeNo}`;
    /*`SELECT orderNo, DATE_FORMAT(orderTime, '%Y-%m-%d %H:%m:%s') AS orderTime, orderStatus, customerTel, totalPrice, cancelYn FROM orders `
    +`WHERE storeNo = ${req.session.user.storeNo} AND cancelYn="N" ORDER BY orderStatus=0;` 
    +`SELECT orderNo, DATE_FORMAT(orderTime, '%Y-%m-%d %H:%m:%s') AS orderTime, orderStatus, customerTel, totalPrice, cancelYn FROM orders `
    +`WHERE storeNo = ${req.session.user.storeNo} AND cancelYn="Y";`*/

    // DB에서 조회
    connection.query(query, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            /*var orders = new Array()
            for (i=0; i<result[0].length; i++)
                orders.push(result[0][i]);
            for (i=0; i<result[1].length; i++)
                orders.push(result[1][i]);*/
            console.log("get order info success");
            res.json({"code": 200, "result": "get order info success", "orders": result})
        }
    })

});

// 2. 주문 상세 조회 라우터
router.get('/getOrderDetails/:orderNo', function (req, res) {
    var orderNo = req.params.orderNo;
    var query = `SELECT menuName, orderDetailPrice, count FROM orderDetail WHERE orderNo = ?;` // 주문상세 조회 쿼리문
                + `SELECT paymentType, DATE_FORMAT(paymentTime,  '%Y-%m-%d %H:%m:%s') AS paymentTime, paymentMethod, paymentPrice FROM payment WHERE orderNo =?;` // 결제정보 조회 쿼리문
                + `SELECT totalPrice FROM orders WHERE orderNo = ?;` // 총 주문금액 조회 쿼리문

    // DB에서 조회
    connection.query(query, [orderNo, orderNo, orderNo], function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get orderDetails success");
            res.json({"code": 200, "result": "get orderDetails success", "orderList": result[0], "payment": result[1], "totalPrice": result[2]})
        }
    })

});

// 3. 주문 상태 변경 라우터
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

// 4. 주문 취소 라우터
router.post('/cancelOrder', function (req, res) {
    var storeNo = req.session.user.storeNo; // 매장 번호
    var orderNo = req.body.orderNo; // 주문 번호
    var paymentType = "주문 취소"; // 결제 타입(주문결제/주문취소)

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