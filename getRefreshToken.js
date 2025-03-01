const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID_2,
    process.env.GOOGLE_CLIENT_SECRET_2,
    process.env.GOOGLE_REDIRECT_URI
);

// Si se proporciona el código como argumento
if (process.argv[2]) {
    oauth2Client.getToken(process.argv[2])
        .then(({ tokens }) => {
            console.log('Access Token:', tokens.access_token);
            console.log('Refresh Token:', tokens.refresh_token);
            console.log('\nGuarda el GOOGLE_REFRESH_TOKEN en tus variables de entorno');
        })
        .catch(error => {
            console.error('Error al obtener tokens:', error);
        });
} else {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events'
        ],
        prompt: 'consent'
    });
    console.log('Visita esta URL:', authUrl);
} 