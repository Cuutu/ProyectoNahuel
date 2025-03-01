const { google } = require('googleapis');

// Configuración centralizada de Google OAuth
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_2,
    process.env.GOOGLE_CLIENT_SECRET_2,
    process.env.GOOGLE_REDIRECT_URI
);

// Configurar credenciales
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Crear cliente de Calendar
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

module.exports = {
    oauth2Client,
    calendar
}; 