'use strict';
const express = require('express');
const router = express.Router();
const keyCtrl = require('../controllers');

router.post('/', keyCtrl.saveToStore);
router.get('/:key', keyCtrl.getFromStore);

module.exports = router;