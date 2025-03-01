const { sendWelcomeEmail } = require('../services/emailService');

const handleSubscription = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Aquí puedes agregar lógica para guardar el email en tu base de datos
        
        // Enviar email de bienvenida con PDF
        const emailSent = await sendWelcomeEmail(email);
        
        if (emailSent) {
            res.json({ success: true, message: 'Suscripción exitosa' });
        } else {
            res.status(500).json({ success: false, message: 'Error al enviar el email' });
        }
    } catch (error) {
        console.error('Error en suscripción:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

module.exports = {
    handleSubscription
}; 