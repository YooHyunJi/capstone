const express = require('express');
const router = express.Router();
const ctrl = require('./order.ctrl');

// api/order/~

router.get('/main/:storeNo', ctrl.orderMain);

router.get('/category/:storeNo', ctrl.getCategoryByStoreNo);
router.get('/menu/:categoryNo', ctrl.getMenuByCategoryNo);

// shopping cart
router.post('/cart/add', ctrl.addShoppingCart);
router.get('/cart/delete', ctrl.deleteShoppingCart);

// add order info
router.post('/add', ctrl.addOrder);
router.post('/add/detail', ctrl.addOrderDetail);
router.post('/add/pay', ctrl.addPayment);


module.exports = router;