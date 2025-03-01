const express = require('express');
const router = express.Router();
const { handleSubscription } = require('../controllers/subscriptionController');
const appointmentController = require('../controllers/appointmentController');
const { isAuthenticated } = require('../middleware/auth');
const { oauth2Client } = require('../config/googleAuth');

// Obtener todas las clases
router.get('/v1/classes', async (req, res) => {
    try {
        // Aquí iría la lógica para obtener las clases
        res.json({ 
            success: true, 
            classes: [] 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al obtener las clases.' 
        });
    }
});

// Crear una nueva clase
router.post('/v1/classes', async (req, res) => {
    try {
        const { date } = req.body;
        // Aquí iría la lógica para crear una clase
        res.json({ 
            success: true, 
            message: 'Clase agendada correctamente' 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al agendar la clase.' 
        });
    }
});

// Ruta para reservar mentoría
router.post('/api/mentoring/book', async (req, res) => {
    try {
        const { date, userId } = req.body;
        
        if (!date) {
            return res.status(400).json({ 
                success: false, 
                error: 'La fecha es requerida' 
            });
        }

        // Aquí puedes agregar la lógica para guardar la reserva en la base de datos
        const booking = await Booking.create({
            date: new Date(date),
            userId: userId || req.user?._id,
            status: 'PENDING'
        });

        res.json({ 
            success: true, 
            message: 'Reserva creada exitosamente',
            booking 
        });
    } catch (error) {
        console.error('Error al procesar la reserva:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Error al procesar la reserva' 
        });
    }
});

// Manejar solicitud de favicon
router.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content
});

// Nueva ruta para suscripciones
router.post('/subscribe', handleSubscription);

// Obtener horarios ocupados
router.get('/booked-slots', appointmentController.getBookedSlots);

// Reservar turno
router.post('/book-appointment', isAuthenticated, appointmentController.bookAppointment);

// Genera la URL de autorización
const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar']
});

console.log('Visita esta URL para autorizar:', url);

// Después de obtener el código de autorización, úsalo para obtener el refresh token
const { tokens } = await oauth2Client.getToken('CÓDIGO_DE_AUTORIZACIÓN');
console.log('Refresh Token:', tokens.refresh_token);

module.exports = router; 