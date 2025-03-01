const { google } = require('googleapis');
const oauth2Client = require('../config/googleAuth');

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const bookingController = {
    createBooking: async (req, res) => {
        try {
            const { fecha, nombre, email, telefono } = req.body;

            // Crear evento en Google Calendar
            const event = {
                summary: `Consultoría Financiera - ${nombre}`,
                description: `Reserva de consultoría\nEmail: ${email}\nTeléfono: ${telefono}`,
                start: {
                    dateTime: fecha,
                    timeZone: 'America/Argentina/Buenos_Aires',
                },
                end: {
                    // Agregar 1 hora a la fecha de inicio
                    dateTime: new Date(new Date(fecha).getTime() + 60 * 60 * 1000).toISOString(),
                    timeZone: 'America/Argentina/Buenos_Aires',
                },
                attendees: [
                    { email: email }
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 }
                    ]
                }
            };

            const response = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                sendUpdates: 'all'
            });

            res.json({
                success: true,
                message: 'Reserva confirmada exitosamente',
                eventId: response.data.id
            });

        } catch (error) {
            console.error('Error al crear la reserva:', error);
            res.status(500).json({
                success: false,
                message: 'Error al procesar la reserva'
            });
        }
    },

    getBookedSlots: async (req, res) => {
        try {
            const { timeMin, timeMax } = req.query;

            const response = await calendar.events.list({
                calendarId: 'primary',
                timeMin: timeMin,
                timeMax: timeMax,
                singleEvents: true,
                orderBy: 'startTime'
            });

            // Extraer solo las fechas ocupadas
            const bookedSlots = response.data.items.map(event => ({
                start: event.start.dateTime,
                end: event.end.dateTime
            }));

            res.json(bookedSlots);
        } catch (error) {
            console.error('Error al obtener turnos ocupados:', error);
            res.status(500).json([]);
        }
    }
};

module.exports = bookingController; 