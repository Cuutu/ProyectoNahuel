const trainingController = {
    getTrainings: async (req, res) => {
        try {
            res.render('training', {
                title: 'Entrenamientos - CryptoTrading',
                user: res.locals.user,
                isAuthenticated: res.locals.isAuthenticated
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar los entrenamientos',
                user: res.locals.user
            });
        }
    },

    getTrainingDetail: async (req, res) => {
        try {
            const trainingId = req.params.id;
            res.render('training/detail', {
                title: 'Detalle del Entrenamiento',
                user: res.locals.user
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el detalle del entrenamiento',
                user: res.locals.user
            });
        }
    },

    getAnalisisTecnico: async (req, res) => {
        try {
            res.render('training/analisis-tecnico', {
                title: 'Análisis Técnico - CryptoTrading',
                user: res.locals.user,
                isAuthenticated: res.locals.isAuthenticated
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el curso',
                user: res.locals.user
            });
        }
    }
};

module.exports = trainingController; 