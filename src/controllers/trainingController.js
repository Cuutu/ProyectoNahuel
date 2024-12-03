const trainingController = {
    getTrainings: async (req, res) => {
        try {
            const trainings = {
                stats: {
                    students: 1500,
                    completionRate: 92,
                    satisfaction: 4.8
                },
                courses: [
                    {
                        id: 'trading-basico',
                        title: 'Trading Básico',
                        description: 'Aprende los fundamentos del trading desde cero',
                        duration: '6 semanas',
                        students: 500,
                        price: '199.99',
                        features: [
                            'Conceptos básicos del mercado',
                            'Análisis técnico fundamental',
                            'Gestión de riesgo',
                            'Psicología del trading'
                        ]
                    },
                    {
                        id: 'trading-avanzado',
                        title: 'Trading Avanzado',
                        description: 'Domina estrategias avanzadas de trading',
                        duration: '8 semanas',
                        students: 300,
                        price: '299.99',
                        features: [
                            'Estrategias avanzadas',
                            'Análisis técnico profundo',
                            'Trading algorítmico',
                            'Gestión de portafolio'
                        ]
                    },
                    {
                        id: 'trading-pro',
                        title: 'Trading Profesional',
                        description: 'Conviértete en un trader profesional',
                        duration: '12 semanas',
                        students: 150,
                        price: '499.99',
                        features: [
                            'Trading institucional',
                            'Estrategias propietarias',
                            'Gestión de capital',
                            'Mentoría personalizada'
                        ]
                    }
                ]
            };

            res.render('training/index', {
                title: 'Entrenamientos - CryptoTrading',
                trainings,
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
            // Aquí posteriormente podríamos obtener los datos de una base de datos
            const training = {
                id: req.params.slug,
                // ... datos del entrenamiento específico
            };

            res.render('training/detail', {
                title: `${training.title} - CryptoTrading`,
                training,
                user: req.session.user
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar el entrenamiento',
                user: req.session.user
            });
        }
    }
};

module.exports = trainingController; 