// NCP SENS API
// juran

const express = require('express');
const router = express.Router();
const ctrl = require('../sens/sens.ctrl');

// api/sens/~

router.post('/order', ctrl.sendOrderMsg); // 주문 완료
router.post('/order', ctrl.sendPickupMsg);

module.exports = router;