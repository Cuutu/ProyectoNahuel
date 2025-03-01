const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

// Validar configuración
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Error: Credenciales de email no configuradas');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Validar conexión al iniciar
transporter.verify()
    .then(() => console.log('Servidor de email listo'))
    .catch(err => console.error('Error en servidor de email:', err));

const sendWelcomeEmail = async (userEmail) => {
    // Validar email
    if (!userEmail || !userEmail.includes('@')) {
        throw new Error('Email inválido');
    }

    try {
        const mailOptions = {
            from: `"CryptoTrading" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: '¡Bienvenido a CryptoTrading! 📈',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <img src="https://tu-logo.com/logo.png" alt="CryptoTrading Logo" style="max-width: 200px; margin: 0 auto; display: block;">
                    <h1 style="color: #00E676; text-align: center; margin-top: 30px;">¡Gracias por suscribirte!</h1>
                    <div style="background-color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="font-size: 16px; line-height: 1.6;">Como agradecimiento por unirte a nuestra comunidad, te enviamos un curso gratuito en PDF con contenido exclusivo.</p>
                        <p style="font-size: 16px; line-height: 1.6;">Este material te ayudará a comenzar tu viaje en el trading de manera profesional.</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #666;">Saludos,<br>El equipo de CryptoTrading</p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: 'curso-trading.pdf',
                    path: path.join(__dirname, '../assets/pdfs/curso-trading.pdf'),
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error enviando email:', {
            error: error.message,
            email: userEmail,
            timestamp: new Date().toISOString()
        });
        throw new Error(`Error al enviar email: ${error.message}`);
    }
};

module.exports = {
    sendWelcomeEmail
}; 