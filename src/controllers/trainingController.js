const trainingController = {
    getTrainings: async (req, res) => {
        try {
            const userSession = req.session.user;
            
            res.render('training', {
                title: 'Entrenamientos - CryptoTrading',
                user: userSession
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar los entrenamientos',
                user: req.session.user
            });
        }
    },

    getAnalisisTecnico: async (req, res) => {
        try {
            const userSession = req.session.user;

            res.render('training/analisis-tecnico', {
                title: 'Análisis Técnico - CryptoTrading',
                user: userSession
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