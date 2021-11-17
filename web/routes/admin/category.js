// 카테고리 관리 관련 라우터 목록
// Author : Sumin, Last Modified : 2021.11.17

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

// 1. 전체 카테고리 조회 라우터
router.get('/getAllCategories', function (req, res) {
    var query = `SELECT categoryNo, categoryName FROM category WHERE storeNo = ${req.session.user.storeNo}`; // 카테고리 조회 쿼리문

    // DB에서 조회
    connection.query(query, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get categories success");
            res.json({"code": 200, "result": "get categories success", "categories": result})
        }
    })

});

// 2. 카테고리 등록 라우터
router.post('/addCategory', function (req, res) {
    var categoryName = req.body.categoryName; // 카테고리명
    var query = `INSERT INTO category (categoryName, storeNo) VALUES(?,${req.session.user.storeNo})`; // 카테고리 등록 쿼리문

    // DB에 카테고리 등록
    connection.query(query, categoryName, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("add category success");
            res.json({"code": 200, "result": "add category success"})
        }
    })

});

// 3. 카테고리 삭제 라우터
router.post('/deleteCategory', function (req, res) {
    var categoryNo = req.body.categoryNo; // 카테고리 번호
    var query = 'DELETE FROM category WHERE categoryNo = ?'; // 카테고리 삭제 쿼리문

    // DB에서 카테고리 삭제
    connection.query(query, categoryNo, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("delete category success");
            res.json({"code": 200, "result": "delete category success"})
        }
    })

});

// 4. 카테고리 수정 라우터
router.post('/updateCategory', function (req, res) {
    var categoryNo = req.body.category_no; // 카테고리 번호
    var categoryName = req.body.category_name; // 카테고리명
    var query = 'UPDATE category SET categoryName = ? WHERE categoryNo = ?'; // 카테고리 수정 쿼리문

    // DB에서 카테고리 정보 수정
    connection.query(query, [categoryName, categoryNo], function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("update category success");
            res.json({"code": 200, "result": "update category success"})
        }
    })

});

module.exports = router;