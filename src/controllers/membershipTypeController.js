const MembershipType = require('../models/MembershipType');

const membershipTypeController = {
    // Obtener todos los tipos de membresía
    getAllTypes: async (req, res) => {
        try {
            const types = await MembershipType.find({ isActive: true });
            res.status(200).json(types);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener tipos de membresía', error: error.message });
        }
    },

    // Crear nuevo tipo de membresía
    createType: async (req, res) => {
        try {
            const { name, description, features, basePrice } = req.body;
            const newType = await MembershipType.create({
                name,
                description,
                features,
                basePrice
            });
            res.status(201).json(newType);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear tipo de membresía', error: error.message });
        }
    },

    // Actualizar tipo de membresía
    updateType: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedType = await MembershipType.findByIdAndUpdate(
                id,
                req.body,
                { new: true }
            );
            res.status(200).json(updatedType);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar tipo de membresía', error: error.message });
        }
    }
};

module.exports = membershipTypeController; 