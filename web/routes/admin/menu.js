// 메뉴 관리 관련 라우터 목록
// Author : Sumin, Last Modified : 2021.11.17

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var connection = config.init();
connection.connect();

// 1. 전체 메뉴 조회 라우터
router.get('/getAllMenus', function (req, res) {
    var query = `SELECT menuNo, menuName, menuDetail, menuPrice, categoryName FROM menu, category `+
     `WHERE menu.storeNo = ${req.session.storeNo} AND menu.categoryNo = category.categoryNo;` // 메뉴 조회 쿼리문

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

// 2. 메뉴 이미지 파일명 조회 라우터
router.get('/getMenuImg/:menuNo', function (req, res) {
    var menuNo = req.params.menuNo;
    var query = `SELECT menuImg FROM menu WHERE menuNo = ?`;

    // DB에서 조회
    connection.query(query, menuNo, function (error, result) {
        if(error) { // 에러 발생시
            console.log("error ocurred: ", error);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get menuImg success");
            res.json({"code": 200, "result": "get menuImg success", "menuImg": result[0].menuImg})
            //res.send(result[0].menuImg);
        }
    })
})

// 3. 카테고리별 메뉴 조회 라우터
router.post('/getMenusByCategory', function (req, res) {
    var categoryName = req.body.categoryName; // 카테고리 번호
    var query = 'SELECT menuNo, categoryName, menuName, menuPrice, menuDetail FROM category, menu WHERE category.categoryName = ? AND menu.categoryNo = category.categoryNo'; // 카테고리별 메뉴 조회 쿼리문

    // DB에서 조회
    connection.query(query, categoryName, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("get menus by category success");
            res.json({"code": 200, "result": "get menus by category success", "menus": result})
        }
    })

});

// 이미지 업로드
var fileName = '' // 메뉴 이미지 파일명
var upload = multer({
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, __dirname + '/../../uploads');
      },
      filename(req, file, done) {
        fileName = Date.now() + '_' + file.originalname
        done(null, fileName);
      },
    })
});

// 4. 메뉴 등록 라우터
router.post('/addMenu', upload.single('menuImg'), function (req, res) {
    var menuName = req.body.menuName; // 메뉴명
    var menuDetail = req.body.menuDetail; // 메뉴 세부사항
    var menuPrice = req.body.menuPrice; // 메뉴 가격
    var menuImg = fileName;//readImageFile(__dirname + '/../../uploads/' + fileName); // 메뉴 이미지
    var categoryName = req.body.selectCategory; // 카테고리명
    var query = `SELECT categoryNo FROM category WHERE storeNo = ${req.session.storeNo} AND categoryName = ?`;

    connection.query(query, categoryName, function (err, result) {
      if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 404, "result": "error ocurred" })
        } else {
            var categoryNo = result[0].categoryNo;
            query = `INSERT INTO menu (menuName, menuDetail, menuPrice, menuImg, categoryNo, storeNo) VALUES(?,?,?,?,?,${req.session.storeNo})`;
            
            // DB에 메뉴 등록
            connection.query(query, [menuName, menuDetail, menuPrice, menuImg, categoryNo], function (err, result) {
              if(err) { // 에러 발생시
                    console.log("error ocurred: ", err);
                    res.json({ "code": 400, "result": "error ocurred" })
                } else {
                    console.log("add menu success");
                    res.json({"code": 200, "result": "add menu success"})
                }
            })
      }
    })

});

// 5. 메뉴 수정 라우터
router.post('/updateMenu', upload.single('menu_img'), function (req, res) {
    var menuNo = req.body.menu_no; // 메뉴 번호
    var menuName = req.body.menu_name; // 메뉴명
    var menuDetail = req.body.menu_detail; // 메뉴 세부사항
    var menuPrice = req.body.menu_price; // 메뉴 가격
    var menuImg = fileName;//readImageFile(__dirname + '/../../uploads/' + fileName); // 메뉴 이미지
    var categoryName = req.body.select_category; // 카테고리명
    var query = `SELECT categoryNo FROM category WHERE storeNo = ${req.session.storeNo} AND categoryName = ?;`

    connection.query(query, categoryName, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            var categoryNo = result[0].categoryNo;
            query = 'UPDATE menu SET menuName = ?, menuDetail = ?, menuPrice = ?, menuImg = ?, categoryNo = ? WHERE menuNo = ?'; // 메뉴 수정 쿼리문

            // DB에서 메뉴 정보 수정
            connection.query(query, [menuName, menuDetail, menuPrice, menuImg, categoryNo, menuNo], function (err, result) {
                if(err) { // 에러 발생시
                    console.log("error ocurred: ", err);
                    res.json({ "code": 400, "result": "error ocurred" })
                } else {
                    console.log("update menu success");
                    res.json({"code": 200, "result": "update menu success"})
                }
            })
        }
    })    

});

// 6. 메뉴 삭제 라우터
router.get('/deleteMenu/:menuNo', function (req, res) {
    var menuNo = req.params.menuNo; // 메뉴 번호
    var query = 'DELETE FROM menu WHERE menuNo = ?'; // 메뉴 삭제 쿼리문

    // DB에서 메뉴 삭제
    connection.query(query, menuNo, function (err) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("delete menu success");
            res.json({"code": 200, "result": "delete menu success"})
        }
    })

});

module.exports = router;