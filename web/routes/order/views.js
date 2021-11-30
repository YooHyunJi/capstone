const express = require('express');
const router = express.Router();
const ctrl = require('./order.ctrl');
var path = require('path');

// router.get('/:storeNo', (req, res) => {
router.get('/', (req, res) => {
    if (!req.session.storeNo) {
        res.sendFile(path.resolve('public/admin/login.html'));
    } else {
        let storeNo = req.session.storeNo; // 가게 세션정보
        res.render(path.resolve('public/order/main.ejs'), {'storeNo': storeNo});
    }
    
});

router.get('/model', (req, res) => {
    if (!req.session.storeNo) {
        res.sendFile(path.resolve('public/admin/login.html'));
    } else {
        let storeNo = req.session.storeNo; // 가게 세션정보
        res.render(path.resolve('public/order/main.model.ejs'), {'storeNo': storeNo});
    }
    
});

module.exports = router;