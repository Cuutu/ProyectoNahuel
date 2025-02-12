const express = require('express');
const router = express.Router();
const Mentoring = require('../models/mentoring');
const auth = require('../middleware/auth');

router.post('/api/mentoring/book', auth, async (req, res) => {
    try {
        const mentoring = new Mentoring({
            userId: req.user.id,
            date: new Date(req.body.date),
            duration: req.body.duration,
            price: req.body.price,
            status: 'pending'
        });

        await mentoring.save();
        
        res.status(201).json({
            success: true,
            mentoring: mentoring
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}); 