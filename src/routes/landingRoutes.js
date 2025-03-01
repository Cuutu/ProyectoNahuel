const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    try {
        res.render('landing');
    } catch (error) {
        console.error('Error al renderizar landing:', error);
        res.status(500).render('error', {
            message: 'Error al cargar la página principal'
        });
    }
});

module.exports = router; 