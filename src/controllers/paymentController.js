const Membership = require('../models/Membership');
const MembershipType = require('../models/MembershipType');

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
    }
};

module.exports = paymentController; 