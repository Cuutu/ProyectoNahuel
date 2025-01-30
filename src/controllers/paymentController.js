const Membership = require('../models/Membership');
const MembershipType = require('../models/MembershipType');
const mercadopago = require('mercadopago');

// Configura MercadoPago con tu access token
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const paymentController = {
    // Procesar pago de membresía
    processPayment: async (req, res) => {
        try {
            const { userId, membershipTypeId, paymentMethod } = req.body;

            // Obtener el tipo de membresía para verificar el precio
            const membershipType = await MembershipType.findById(membershipTypeId);
            
            // Aquí iría la lógica de procesamiento de pago con tu gateway de pagos
            const paymentInfo = {
                transactionId: 'mock_' + Date.now(),
                paymentMethod,
                paymentDate: new Date()
            };

            // Crear la membresía una vez confirmado el pago
            const membership = await Membership.create({
                user: userId,
                membershipType: membershipTypeId,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                actualPrice: membershipType.basePrice,
                paymentInfo
            });

            res.status(200).json({
                success: true,
                membership
            });
        } catch (error) {
            res.status(500).json({ message: 'Error en el proceso de pago', error: error.message });
        }
    },

    // Obtener historial de pagos
    getPaymentHistory: async (req, res) => {
        try {
            const { userId } = req.params;
            const payments = await Membership.find({ user: userId })
                .select('paymentInfo actualPrice startDate')
                .populate('membershipType', 'name');

            res.status(200).json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener historial de pagos.', error: error.message });
        }
    },

    createOrder: async (req, res) => {
        try {
            const preference = {
                items: [
                    {
                        title: "Señales Premium",
                        unit_price: 99.99,
                        quantity: 1,
                        currency_id: "ARS"  // o "USD" según tu configuración
                    }
                ],
                back_urls: {
                    success: "https://proyecto-nahuel.vercel.app/payment/success",
                    failure: "https://proyecto-nahuel.vercel.app/payment/failure",
                    pending: "https://proyecto-nahuel.vercel.app/payment/pending"
                },
                auto_return: "approved",
                notification_url: "https://proyecto-nahuel.vercel.app/webhook"
            };

            const response = await mercadopago.preferences.create(preference);
            console.log('Preference created:', response);
            
            res.json({
                init_point: response.body.init_point
            });
        } catch (error) {
            console.error('Error creating payment:', error);
            res.status(500).json({ error: 'Error al crear el pago' });
        }
    },

    handleWebhook: async (req, res) => {
        try {
            const payment = req.query;
            console.log('Payment notification received:', payment);
            
            if (payment.type === 'payment') {
                const data = await mercadopago.payment.findById(payment['data.id']);
                console.log('Payment data:', data);
                // Aquí puedes actualizar el estado de la suscripción del usuario
            }
            
            res.status(200).send('OK');
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).send('Error processing webhook');
        }
    }
};

module.exports = paymentController; 