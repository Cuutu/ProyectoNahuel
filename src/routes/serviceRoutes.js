const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

router.get('/servicios', servicesController.getServices);

module.exports = router; 