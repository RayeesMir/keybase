const express = require('express');
const router = express.Router();
const KeyStore = require('../controllers');

router.post('/', KeyStore.saveToStore);
router.get('/:key', KeyStore.getFromStore);

module.exports = router;