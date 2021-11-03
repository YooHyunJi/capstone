// 메뉴 수정
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var connection = config.init();
connection.connect();

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

router.post('/updateMenu', upload.single('menu_img'), function (req, res) {
    var menuNo = req.body.menu_no; // 메뉴 번호
    var menuName = req.body.menu_name; // 메뉴명
    var menuDetail = req.body.menu_detail; // 메뉴 세부사항
    var menuPrice = req.body.menu_price; // 메뉴 가격
    var menuImg = readImageFile(__dirname + '/../../uploads/' + fileName); // 메뉴 이미지
    var categoryName = req.body.select_category; // 카테고리명
    var query = `SELECT categoryNo FROM category WHERE storeNo = ${req.session.user.storeNo} AND categoryName = ?;`

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

// 서버에서 이미지를 읽어오는 메서드
function readImageFile(file){
    const bitmap = fs.readFileSync(file);
    const buf = new Buffer.from(bitmap);
    return buf
}

module.exports = router;