const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/dashboard', isAuthenticated, userController.getDashboard);

module.exports = router; 