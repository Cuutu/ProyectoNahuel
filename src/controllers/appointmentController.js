const { calendar } = require('../config/googleAuth');
const Appointment = require('../models/Appointment');

exports.getBookedSlots = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            datetime: {
                $gte: new Date()
            },
            status: 'confirmed'
        });
        
        res.json(appointments.map(apt => ({
            datetime: apt.datetime
        })));
    } catch (error) {
        console.error('Error obteniendo horarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const { datetime } = req.body;
        
        // Verificar si el horario ya está reservado
        const existingAppointment = await Appointment.findOne({
            datetime: new Date(datetime),
            status: 'confirmed'
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                error: 'Este horario ya está reservado'
            });
        }

        // Crear evento en Google Calendar
        const event = {
            summary: 'Consultoría Financiera',
            description: `Consultoría con ${req.user.email}`,
            start: {
                dateTime: datetime,
                timeZone: 'America/Argentina/Buenos_Aires',
            },
            end: {
                dateTime: new Date(new Date(datetime).getTime() + 60*60*1000).toISOString(),
                timeZone: 'America/Argentina/Buenos_Aires',
            },
            attendees: [{ email: req.user.email }],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 30 },
                ],
            },
        };

        const googleEvent = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            sendUpdates: 'all',
        });

        // Guardar la cita en la base de datos
        const appointment = new Appointment({
            datetime: new Date(datetime),
            userId: req.user._id,
            userEmail: req.user.email,
            status: 'confirmed',
            googleEventId: googleEvent.data.id
        });

        await appointment.save();

        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Error reservando turno:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}; 