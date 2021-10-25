const express = require('express');
const router = express.Router();
const ctrl = require('./order.ctrl');

router.get('/category/:storeNo', ctrl.getCategoryList);
router.get('/menu/:storeNo/:categoryNo', ctrl.getMenuList);

module.exports = router;