const Membership = require('../models/Membership');
const User = require('../models/User');

const membershipController = {
    // Crear nueva membresía para un usuario
    createMembership: async (req, res) => {
        try {
            const { userId, membershipTypeId, actualPrice } = req.body;
            
            // Calcular fecha de fin basada en el tipo de membresía
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30); // Ejemplo: 30 días

            const membership = await Membership.create({
                user: userId,
                membershipType: membershipTypeId,
                startDate: new Date(),
                endDate,
                actualPrice,
                status: 'active'
            });

            // Actualizar la membresía actual del usuario
            await User.findByIdAndUpdate(userId, {
                currentMembership: membership._id
            });

            res.status(201).json(membership);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear membresía', error: error.message });
        }
    },

    // Obtener membresía actual de un usuario
    getCurrentMembership: async (req, res) => {
        try {
            const { userId } = req.params;
            const membership = await Membership.findOne({ 
                user: userId,
                status: 'active'
            }).populate('membershipType');
            
            res.status(200).json(membership);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener membresía', error: error.message });
        }
    },

    // Cancelar membresía
    cancelMembership: async (req, res) => {
        try {
            const { membershipId } = req.params;
            const membership = await Membership.findByIdAndUpdate(
                membershipId,
                { status: 'cancelled' },
                { new: true }
            );

            // Actualizar usuario
            await User.findByIdAndUpdate(membership.user, {
                currentMembership: null
            });

            res.status(200).json(membership);
        } catch (error) {
            res.status(500).json({ message: 'Error al cancelar membresía', error: error.message });
        }
    },

    // Renovar membresía
    renewMembership: async (req, res) => {
        try {
            const { membershipId } = req.params;
            const membership = await Membership.findById(membershipId);

            const endDate = new Date(membership.endDate);
            endDate.setDate(endDate.getDate() + 30); // Ejemplo: 30 días más

            const updatedMembership = await Membership.findByIdAndUpdate(
                membershipId,
                { 
                    endDate,
                    status: 'active'
                },
                { new: true }
            );

            res.status(200).json(updatedMembership);
        } catch (error) {
            res.status(500).json({ message: 'Error al renovar membresía', error: error.message });
        }
    }
};

module.exports = membershipController; 