// 메뉴 등록
// Author : Sumin, Created : 2021.10.09, Last modified : 2021.10.27

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

router.post('/addMenu', upload.single('menuImg'), function (req, res) {
    var menuName = req.body.menuName; // 메뉴명
    var menuDetail = req.body.menuDetail; // 메뉴 세부사항
    var menuPrice = req.body.menuPrice; // 메뉴 가격
    var menuImg = readImageFile(__dirname + '/../../uploads/' + fileName); // 메뉴 이미지
    var categoryNo = req.body.categoryNo; // 카테고리 번호
    var query = `INSERT INTO menu (menuName, menuDetail, menuPrice, menuImg, categoryNo, storeNo) VALUES(?,?,?,?,?,${req.session.user.storeNo})`;
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

});

// 서버에서 이미지를 읽어오는 메서드
function readImageFile(file){
    const bitmap = fs.readFileSync(file);
    const buf = new Buffer.from(bitmap);
    return buf
}

module.exports = router;