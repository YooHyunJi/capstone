const express = require('express');
const router = express.Router();
const ctrl = require('./order.ctrl');
var path = require('path');

router.get('/:storeNo', (req, res) => {
    res.render(path.resolve('public/order/main.ejs'));
});

module.exports = router;