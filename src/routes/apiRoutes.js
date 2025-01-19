const express = require('express');
const router = express.Router();

// Obtener todas las clases
router.get('/v1/classes', async (req, res) => {
    try {
        // Aquí deberías obtener las clases de tu base de datos
        // Por ahora retornamos un array de ejemplo
        const classes = [
            { date: new Date(), id: 1 },
            { date: new Date(Date.now() + 86400000), id: 2 } // mañana
        ];
        res.json({ success: true, classes });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
});

// Crear una nueva clase
router.post('/v1/classes', async (req, res) => {
    try {
        const { date } = req.body;
        // Aquí deberías guardar la clase en tu base de datos
        // Por ahora solo retornamos éxito
        res.json({ success: true, message: 'Clase agendada correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al agendar la clase' });
    }
});

module.exports = router; 