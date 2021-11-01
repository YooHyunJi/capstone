let path = require('path');
let moment = require('moment');
const config = require('../../config/db_config');
const { runInNewContext } = require('vm');
const connection = config.init();
connection.connect();

// 카테고리 리스트 + 첫번째 카테고리 메뉴리스트
const orderMain = (req, res) => {
    let storeNo = parseInt(req.params.storeNo, 10);
    if (Number.isNaN(storeNo) || !storeNo) { // 가게일련번호가 잘못되었을 때
        return res.status(400).end();
    } 

    let query1 = ' SELECT * FROM category WHERE storeNo = ?;';
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
            console.log('success');
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
    let query = 'SELECT * FROM category WHERE storeNo = ?';
    connection.query(query, storeNo, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('get category list success');
            res.status(200).json(result).end();

            // ejs
            // res.render(path.resolve('public/order/main.ejs'), {'categoryList' : result});
        }
    });
}

// 메뉴 리스트 조회
const getMenuByCategoryNo = (req, res) => {
    let categoryNo = parseInt(req.params.categoryNo, 10);
    let query = 'SELECT * FROM menu WHERE categoryNo = ?';
    connection.query(query, categoryNo, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('get category list success');
            res.status(200).json(result).end();
        }
    });
}

// 장바구니 추가
// const addShoppingCart = (req, res) => {
//     let menuNo = req.body.menuNo;

//     // 쿠키에 정보가 있을 때
//     if (req.cookie.shoppingCart) {
//         let shoppingCart = req.cookie.shoppingCart;
//     } else { // 쿠키에 저장된 정보가 없을 때 새로 생성
//         let shoppingCart = {};
//     }

//     // 기존에 장바구니에 있던 메뉴 추기
//     if (menuNo in shoppingCart) { // 1개씩 추가 가능
//         shoppingCart[menuNo]['count'] += 1;
//         shoppingCart[menuNo]['totalPrice'] += shoppingCart[menuNo]['meunPrice'];
//     } else { // 새롭게 추가
//         shoppingCart[menuNo] = {
//             'menuName': res.body.menuName,
//             'menuPrice': res.body.menuPrice,
//             'totalPrice': res.body.totalPrice,
//             'count': 1
//         };
//     }

//     // 쿠키 설정, 응답 전송
//     res.cookie('shoppingCart', shoppingCart);
//     res.status(201).json(shoppingCart).end();
// }

// // 장바구니 삭제
// const deleteShoppingCart = (req, res) => {
//     let menuNo = req.body.menuNo;

//     // 쿠키에 정보가 있을 때
//     if (req.cookie.shoppingCart) {
//         let shoppingCart = req.cookie.shoppingCart;
//     } else { // 쿠키에 저장된 정보가 없을 때 새로 생성
//         let shoppingCart = {};
//     }

//     // 기존에 장바구니에 있던 메뉴 추기
//     if (menuNo in shoppingCart) { // 1개씩 삭제 가능
//         if (shoppingCart[menuNo]['count'] == 1){
//             delete shoppingCart[menuNo];
//         } else {
//             shoppingCart[menuNo]['count'] -= 1;
//             shoppingCart[menuNo]['totalPrice'] -= shoppingCart[menuNo]['meunPrice'];        
//         }
//         // 쿠키 설정, 응답 전송
//         res.cookie('shoppingCart', shoppingCart);
//         res.send(200).json(shoppingCart).end();
//     } else { // 없는 메뉴 삭제 요청이 들어올 때 오류 발생
//         res.status(404).end();
//     }
// }


// 주문 정보 추가
const addOrder = (req, res) => {
    const orderTime = moment().format("YYYY-MM-DD hh:mm:ss");
    let customerTel = req.body.customerTel;
    let totalPrice = req.body.totalPrice;
    let storeNo = req.body.storeNo;
    let params = [orderTime, customerTel, totalPrice, storeNo, orderTime];

    let insertQuery = `INSERT INTO orders(orderTime, customerTel, totalPrice, storeNo) VALUE (?, ?, ?, ?);`
    let selectQuery =  ` SELECT orderNo FROM orders WHERE orderTime = ?;`
    connection.query(insertQuery + selectQuery, params, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('add order success');
            res.status(200).json(result[1]).end();
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
    let params = [payTime, paymentMethod, paymentPrice, storeNo, orderNo];

    let addQuery = `INSERT INTO payment(paymentType, paymentTime, paymentMethod, paymentPrice, storeNo, orderNo) VALUE (?, ?, ?, ?, ?, ?);`
    connection.query(addQuery, params, function(err, result) {
        if(err) {
            console.log('error occured: ', err);
            res.status(400).end();
        } else {
            console.log('add payment success');
            res.status(200).end();
        }
    });
}

module.exports = {
    getCategoryByStoreNo, orderMain, getMenuByCategoryNo, addOrder, addPayment, addOrderDetail
}
