const express = require('express');
const router = express.Router();
const { handleSubscription } = require('../controllers/subscriptionController');
const appointmentController = require('../controllers/appointmentController');
const { isAuthenticated } = require('../middleware/auth');
const { calendar } = require('../config/googleAuth');
const mongoose = require('mongoose');

// Asegurarse de que MongoDB esté conectado
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error;
    }
};

// Obtener todas las clases
router.get('/v1/classes', async (req, res) => {
    try {
        await connectDB();
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
router.get('/booked-slots', async (req, res) => {
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        res.json({ success: true, events: response.data.items });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al obtener horarios' });
    }
});

// Reservar turno
router.post('/book-appointment', isAuthenticated, async (req, res) => {
    try {
        const { datetime } = req.body;
        
        const event = {
            summary: 'Consultoría',
            start: {
                dateTime: datetime,
                timeZone: 'America/Argentina/Buenos_Aires',
            },
            end: {
                dateTime: new Date(new Date(datetime).getTime() + 60*60*1000).toISOString(),
                timeZone: 'America/Argentina/Buenos_Aires',
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        res.json({ success: true, event: response.data });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error al reservar turno' });
    }
});

module.exports = router; 