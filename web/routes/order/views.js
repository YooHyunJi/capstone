const express = require('express');
const router = express.Router();
const ctrl = require('./order.ctrl');
var path = require('path');

// router.get('/:storeNo', (req, res) => {
router.get('/', (req, res) => {
    if (!req.session.user) {
        res.sendFile(path.resolve('public/admin/login.html'));
    } else {
        let storeNo = req.session.user.storeNo; // 가게 세션정보
        res.render(path.resolve('public/order/main.ejs'), {'storeNo': storeNo});
    }
    
});

module.exports = router;