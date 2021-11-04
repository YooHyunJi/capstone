const express = require('express');
const router = express.Router();
const ctrl = require('./order.ctrl');
const sens = require('../sens');

// api/order/~

router.get('/main/:storeNo', ctrl.orderMain);

router.get('/category/:storeNo', ctrl.getCategoryByStoreNo);
router.get('/menu/:categoryNo', ctrl.getMenuByCategoryNo);

// add order info
router.post('/add', ctrl.addOrder);
router.post('/add/detail', ctrl.addOrderDetail);
router.post('/add/pay', ctrl.addPayment);

// send message (naver api) 
router.post('/send/msg', sens.sendOrderMsg);

module.exports = router;