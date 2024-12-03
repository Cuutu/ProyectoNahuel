const sessionCheck = (req, res, next) => {
    if (req.session && req.session.user) {
        // Verificar si la sesión está próxima a expirar (por ejemplo, menos de 1 hora)
        const horaParaExpirar = req.session.cookie.maxAge / (1000 * 60 * 60);
        
        if (horaParaExpirar < 1) {
            // Renovar la sesión
            req.session.touch();
        }
    }
    next();
};

module.exports = sessionCheck; 