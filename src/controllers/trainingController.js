const trainingController = {
    getTrainings: async (req, res) => {
        try {
            res.render('training', {
                title: 'Entrenamientos - CryptoTrading',
                user: req.session.user
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar los entrenamientos',
                user: req.session.user
            });
        }
    },

    getTrainingDetail: async (req, res) => {
        try {
            const trainingId = req.params.id;
            res.render('training/detail', {
                title: 'Detalle del Entrenamiento',
                user: req.session.user
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el detalle del entrenamiento',
                user: req.session.user
            });
        }
    },

    getAnalisisTecnico: async (req, res) => {
        try {
            res.render('training/analisis-tecnico', {
                title: 'Análisis Técnico - CryptoTrading',
                user: req.session.user
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el curso',
                user: req.session.user
            });
        }
    }
};

module.exports = trainingController; 