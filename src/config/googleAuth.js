const { google } = require('googleapis');

// Crear cliente OAuth2
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_2,
    process.env.GOOGLE_CLIENT_SECRET_2,
    process.env.GOOGLE_REDIRECT_URI
);

// Configurar el refresh token
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

// Crear cliente de calendario
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

module.exports = { calendar }; 