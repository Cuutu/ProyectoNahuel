const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');

// Ruta principal de Cashflow (simplificada)
router.get('/', isAuthenticated, (req, res) => {
    res.render('cashflow/index', {
        title: 'Cashflow Dashboard',
        user: req.user || req.session.user,
        activePage: 'cashflow'
    });
});

// Aquí puedes agregar más rutas específicas para Cashflow
// Por ejemplo: estadísticas, informes, etc.

module.exports = router; 