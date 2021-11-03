// 로그아웃
// Author : Sumin, Created : 21.10.27

var express = require('express');
var router = express.Router();

router.get('/logout', function (req, res) {
    req.session.destroy(function(){
        req.session.user;
    });
    console.log('로그아웃 성공');
});

module.exports = router;