let path = require('path');
let moment = require('moment');
const config = require('../../config/db_config');
const connection = config.init();
connection.connect();

// 카테고리 리스트 + 첫번째 카테고리 메뉴리스트
const orderMain = (req, res) => {
    let storeNo = parseInt(req.params.storeNo, 10);
    if (Number.isNaN(storeNo) || !storeNo) { // 가게일련번호가 잘못되었을 때
        return res.status(400).end();
    } 

    let query1 = ' SELECT categoryNo, categoryName FROM category WHERE storeNo = ?;';
    let query2 = `  SELECT *
                    FROM menu
                    WHERE categoryNo IN (
                        SELECT categoryNo
                        FROM (
                            SELECT categoryNo
                            FROM category C
                            WHERE C.storeNo = ?
                            LIMIT 1
                                ) AS tmp
                        );`;
    
    connection.query(query1 + query2, [storeNo, storeNo], function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            return res.status(400).end();
        } else {
            console.log('select category & first menu success');
            let data = {
                'category': result[0],
                'menu': result[1]
            }
            return res.status(200).json(data).end();
        }
    });
}

// 카테고리 리스트 조회
const getCategoryByStoreNo = (req, res) => {
    let storeNo = parseInt(req.params.storeNo, 10);
    let query = 'SELECT categoryNo, categoryName FROM category WHERE storeNo = ?';
    connection.query(query, storeNo, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('select category success');
            res.status(200).json(result).end();

            // ejs
            // res.render(path.resolve('public/order/main.ejs'), {'categoryList' : result});
        }
    });
}

// 메뉴 리스트 조회
const getMenuByCategoryNo = (req, res) => {
    let categoryNo = parseInt(req.params.categoryNo, 10);
    let query = 'SELECT menuNo, menuName, menuDetail, menuPrice, categoryNo, menuImg FROM menu WHERE categoryNo = ?';
    connection.query(query, categoryNo, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('select menu success');
            res.status(200).json(result).end();
        }
    });
}

// 주문 정보 추가
const addOrder = (req, res) => {
    const orderTime = moment().format("YYYY-MM-DD hh:mm:ss");
    let customerTel = req.body.customerTel;
    let totalPrice = req.body.totalPrice;
    let storeNo = req.body.storeNo;
    let params = [orderTime, customerTel, totalPrice, storeNo];

    let insertOrderQuery = `INSERT INTO orders(orderTime, customerTel, totalPrice, storeNo) VALUE (?, ?, ?, ?); SELECT LAST_INSERT_ID();`
    connection.query(insertOrderQuery, params, function(err, result) {
        if(err) {
            console.log('insert order rror ', err);
            res.status(400).end();
        } else {
            console.log('add order success');
            res.status(200).json({"orderNo": result[1][0]["LAST_INSERT_ID()"]}).end();
        }
    });
}

// 주문 상세정보 추가
const addOrderDetail = (req, res) => {
    let cout = req.body.count;
    let orderDetailPrice = req.body.orderDetailPrice;
    let storeNo = req.body.storeNo;
    let orderNo = req.body.orderNo;
    let menuNo = req.body.menuNo;
    let menuName = req.body.menuName;
    let params = [cout, orderDetailPrice, storeNo, orderNo, menuNo, menuName];

    let insertQuery = `INSERT INTO orderDetail(count, orderDetailPrice, storeNo, orderNo, menuNo, menuName) VALUE (?, ?, ?, ?, ?, ?);`
    connection.query(insertQuery, params, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('add order details success');
            res.status(200).end();
        }
    });
}

// 결제 정보 추가
const addPayment = (req, res) => {
    const payTime = moment().format("YYYY-MM-DD hh:mm:ss");
    let paymentMethod = req.body.paymentMethod;
    let paymentPrice = req.body.paymentPrice;
    let storeNo = req.body.storeNo;
    let orderNo = req.body.orderNo;
    let params1 = ['결제', payTime, paymentMethod, paymentPrice, storeNo, orderNo];

    let shoppingCartDict = JSON.parse(req.body.shoppingCart);
    let params2 = [];
    // console.log(JSON.parse(shoppingCartDict));
    for (let key in shoppingCartDict) {
        var value = shoppingCartDict[key];
        console.log(value);
        params2.push([value["count"], value["totalPrice"], storeNo, orderNo, value["menuNo"], value["menuName"]]);
    };
    console.log(params2);

    let insertPaymentQuery = `INSERT INTO payment(paymentType, paymentTime, paymentMethod, paymentPrice, storeNo, orderNo) VALUE (?, ?, ?, ?, ?, ?); `
    let insertOrderDetailQuery =  `INSERT INTO orderDetail(count, orderDetailPrice, storeNo, orderNo, menuNo, menuName) VALUES ?;`
    connection.query(insertPaymentQuery, params1, function(err, result) {
        if(err) {
            console.log('add payment error ', err);
            res.status(400).end();
        } else {
            console.log('add payment success');
            connection.query(insertOrderDetailQuery, [params2], function(err, result) {
                if(err) {
                    console.log('insert orderDetail error ', err);
                    res.status(400).end();
                } else {
                    console.log('add orderDetail & payment success');
                    res.json({"orderNo": orderNo}).status(200).end();
                }
            });
            // res.status(200).end();
        }
    });
}

module.exports = {
    getCategoryByStoreNo, orderMain, getMenuByCategoryNo, addOrder, addPayment, addOrderDetail
}
