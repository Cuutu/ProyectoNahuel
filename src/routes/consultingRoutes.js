const express = require('express');
const router = express.Router();
const consultingController = require('../controllers/consultingController');

router.get('/', consultingController.getConsulting);

module.exports = router; 