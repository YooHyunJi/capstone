const express = require('express');
const router = express.Router();
const ctrl = require('./order.ctrl');

// api/order/~

router.get('/main/:storeNo', ctrl.orderMain);

router.get('/category/:storeNo', ctrl.getCategoryByStoreNo);
router.get('/menu/:categoryNo', ctrl.getMenuByCategoryNo);

// add order info
router.post('/add/orderInfo', ctrl.addOrder);
router.post('/add/orderDetail', ctrl.addOrderDetail);
router.post('/add/payment', ctrl.addPayment);

module.exports = router;