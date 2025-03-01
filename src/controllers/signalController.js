const Signal = require('../models/Signal');

const signalController = {
    createSignal: async (req, res) => {
        try {
            const signal = new Signal(req.body);
            await signal.save();
            res.status(201).json(signal);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getActiveSignals: async (req, res) => {
        try {
            const signals = await Signal.find({ status: 'active' })
                                      .sort({ createdAt: -1 });
            res.json(signals);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateSignalStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const signal = await Signal.findByIdAndUpdate(
                id,
                { status, updatedAt: Date.now() },
                { new: true }
            );
            res.json(signal);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = signalController; 