const { calendar } = require('../config/googleAuth');

async function testGoogleAuth() {
    try {
        // Intentar listar los próximos 10 eventos
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        console.log('Conexión exitosa con Google Calendar');
        console.log('Eventos encontrados:', response.data.items.length);
    } catch (error) {
        console.error('Error al conectar con Google Calendar:', error.message);
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
        }
    }
}

testGoogleAuth(); 