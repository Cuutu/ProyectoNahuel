const consultingController = {
    getConsulting: (req, res) => {
        try {
            res.render('consulting', {
                title: 'Asesoramientos - CryptoTrading',
                user: req.user || req.session.user,
                isAuthenticated: req.isAuthenticated() || !!req.session.user
            });
        } catch (error) {
            console.error('Error en getConsulting:', error);
            res.status(500).render('error', {
                message: 'Error al cargar la página de asesoramientos',
                error: error
            });
        }
    }
};

module.exports = consultingController; 