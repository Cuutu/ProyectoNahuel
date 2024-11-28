const Service = require('../models/Service');

const servicesController = {
    getServices: async (req, res) => {
        try {
            // Obtener estadísticas de cada servicio
            const signalsStats = await Service.findOne({ name: 'signals' });
            const mentoringStats = await Service.findOne({ name: 'mentoring' });
            const communityStats = await Service.findOne({ name: 'community' });

            res.render('services', {
                stats: {
                    signals: {
                        count: signalsStats?.subscribersCount || 0,
                        label: 'Traders Activos',
                        description: 'en Señales Premium',
                        icon: '👥'
                    },
                    mentoring: {
                        count: mentoringStats?.subscribersCount || 0,
                        label: 'Alumnos',
                        description: 'en Mentoría PRO',
                        icon: '👨‍🏫'
                    },
                    community: {
                        count: communityStats?.subscribersCount || 0,
                        label: 'Miembros VIP',
                        description: 'en nuestra Comunidad',
                        icon: '🌟'
                    }
                }
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).send('Error al cargar la página');
        }
    }
};

module.exports = servicesController; 