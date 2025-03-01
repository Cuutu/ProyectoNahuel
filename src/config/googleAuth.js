const { google } = require('googleapis');

// Crear y configurar el cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_2,
    process.env.GOOGLE_CLIENT_SECRET_2,
    process.env.GOOGLE_REDIRECT_URI
);

// Configurar las credenciales
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Crear el cliente del calendario
const calendar = google.calendar({ 
    version: 'v3', 
    auth: oauth2Client 
});

// Función asíncrona para refrescar el token si es necesario
const getAuthenticatedCalendar = async () => {
    try {
        // Verificar y refrescar el token si es necesario
        await oauth2Client.getAccessToken();
        return calendar;
    } catch (error) {
        console.error('Error al autenticar con Google Calendar:', error);
        throw error;
    }
};

module.exports = {
    oauth2Client,
    calendar,
    getAuthenticatedCalendar
}; 