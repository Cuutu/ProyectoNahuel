const Membership = require('../models/Membership');
const MembershipType = require('../models/MembershipType');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Configurar MercadoPago con tu access token
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
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
            if (!req.session.user) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const { serviceType, price, title } = req.body;
            
            // Configurar los detalles del servicio según el tipo
            let serviceDetails = {
                title: "Señales Premium - Suscripción Mensual",
                unit_price: 99.99,
                serviceType: "signals"
            };
            
            // Si se proporciona un tipo de servicio específico, usar esos detalles
            if (serviceType) {
                if (serviceType === "traderCall") {
                    serviceDetails = {
                        title: title || "Trader Call - Servicio Premium",
                        unit_price: price || 149.99,
                        serviceType: "traderCall"
                    };
                } else if (serviceType === "signals") {
                    serviceDetails = {
                        title: title || "Señales Premium - Suscripción Mensual",
                        unit_price: price || 99.99,
                        serviceType: "signals"
                    };
                }
            }

            const preference = {
                items: [
                    {
                        title: serviceDetails.title,
                        unit_price: serviceDetails.unit_price,
                        quantity: 1,
                        currency_id: "ARS"
                    }
                ],
                back_urls: {
                    success: `${process.env.BASE_URL}/payment/success`,
                    failure: `${process.env.BASE_URL}/payment/failure`,
                    pending: `${process.env.BASE_URL}/payment/pending`
                },
                auto_return: "approved",
                external_reference: `USER_${req.session.user._id}_SERVICE_${serviceDetails.serviceType}`,
                notification_url: `${process.env.BASE_URL}/payment/webhook`
            };

            const preferenceResponse = await new Preference(client).create({ body: preference });
            
            if (!preferenceResponse || !preferenceResponse.id) {
                throw new Error('No se pudo crear la preferencia de pago');
            }

            return res.json({
                id: preferenceResponse.id,
                init_point: preferenceResponse.init_point
            });
        } catch (error) {
            console.error('Error al crear preferencia:', error);
            return res.status(500).json({ 
                error: true, 
                message: 'Error al procesar el pago',
                details: error.message 
            });
        }
    },

    handleWebhook: async (req, res) => {
        try {
            const payment = req.query;
            console.log('Payment notification received:', payment);
            
            if (payment.type === 'payment') {
                const paymentData = await new Payment(client).get({ id: payment['data.id'] });
                console.log('Payment data:', paymentData);

                if (paymentData.status === 'approved') {
                    // Extraer información del external_reference
                    const externalRef = paymentData.external_reference || '';
                    const parts = externalRef.split('_');
                    const userId = parts[1];
                    const serviceType = parts[3] || 'signals'; // Por defecto 'signals' si no se especifica
                    
                    // Crear suscripción
                    const startDate = new Date();
                    const endDate = new Date();
                    
                    // Si es trader call, la duración es diferente (podría ser un servicio único)
                    if (serviceType === 'traderCall') {
                        endDate.setMonth(endDate.getMonth() + 3); // 3 meses para Trader Call
                    } else {
                        endDate.setMonth(endDate.getMonth() + 1); // 1 mes para señales
                    }

                    const subscription = await Subscription.create({
                        userId: userId,
                        serviceType: serviceType,
                        status: 'active',
                        startDate,
                        endDate,
                        paymentId: paymentData.id
                    });

                    // Actualizar usuario con la suscripción activa
                    await User.findByIdAndUpdate(subscription.userId, {
                        $set: { activeSubscription: subscription._id }
                    });
                }
            }
            
            res.status(200).send('OK');
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).send('Error processing webhook');
        }
    }
};

module.exports = paymentController; 