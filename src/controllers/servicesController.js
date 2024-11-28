const servicesController = {
    getServices: async (req, res) => {
        try {
            res.render('services', {
                title: "Nuestros Servicios",
                description: "Descubre nuestros servicios premium de trading",
                stats: {
                    signals: {
                        count: 1500,
                        label: 'Traders Activos',
                        description: 'en Señales Premium',
                        icon: '👥'
                    },
                    mentoring: {
                        count: 500,
                        label: 'Alumnos',
                        description: 'en Mentoría PRO',
                        icon: '👨‍🏫'
                    },
                    community: {
                        count: 2500,
                        label: 'Miembros VIP',
                        description: 'en nuestra Comunidad',
                        icon: '🌟'
                    }
                }
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar la página'
            });
        }
    }
};

module.exports = servicesController; 