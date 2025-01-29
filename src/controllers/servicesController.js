const servicesController = {
    getSignals: async (req, res) => {
        try {
            res.render('services/signals', {
                title: "Señales Premium",
                user: req.session.user,
                service: {
                    name: "Señales Premium",
                    description: "Señales de trading en tiempo real con alta precisión",
                    price: "99.99",
                    features: [
                        "Señales 24/7 en tiempo real",
                        "Setup completo de entrada",
                        "Stop Loss y Take Profit",
                        "Análisis de mercado diario"
                    ]
                }
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).render('error', { 
                message: 'Error al cargar la página',
                user: req.session.user
            });
        }
    },
    getServices: async (req, res) => {
        try {
            // Debug de sesión en el controlador
            console.log('=== Debug Controlador Servicios ===');
            console.log('Session:', req.session);
            console.log('User:', req.user || req.session.user);
            console.log('IsAuthenticated:', req.isAuthenticated());

            res.render('services', {
                title: "Nuestros Servicios",
                user: req.user || req.session.user,
                isAuthenticated: req.isAuthenticated() || !!req.session.user,
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
                message: 'Error al cargar la página',
                user: req.user || req.session.user
            });
        }
    }
};

module.exports = servicesController; 