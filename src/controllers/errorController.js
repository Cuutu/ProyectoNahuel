const errorController = {
    renderError: (err, req, res, next) => {
        // Log detallado del error para debugging
        console.error('Error detallado:', {
            message: err.message,
            stack: err.stack,
            status: err.status
        });

        // Renderizar vista de error con más información
        res.status(err.status || 500).render('error', {
            title: 'Error',
            message: err.message || 'Ha ocurrido un error en el servidor',
            error: process.env.NODE_ENV === 'development' ? err : {},
            user: req.user || req.session?.user || null,
            isAuthenticated: req.isAuthenticated?.() || !!req.session?.user,
            returnTo: req.header('Referer') || '/'
        });
    }
};

module.exports = errorController; 