const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard/index', { 
        user: req.user,
        isAuthenticated: true
    });
});

module.exports = router; 