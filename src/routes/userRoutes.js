const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, userController.getDashboard);

module.exports = router; 