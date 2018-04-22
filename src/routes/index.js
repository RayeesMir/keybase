const express = require('express');
const router = express.Router();
const KeyStore = require('../controller');

router.route('/object')
    .post(KeyStore.saveToStore);
router.route('/object/:key')
    .get(KeyStore.getFromStore);

module.exports = router;