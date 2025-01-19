const express = require('express');
const router = express.Router();

// Ruta para manejar las clases
router.post('/v1/classes', async (req, res) => {
    try {
        // Lógica para manejar la creación de clases
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router; 