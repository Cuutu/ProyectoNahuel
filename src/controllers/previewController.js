/**
 * Controlador para las vistas previas de Trader Call
 * Permite a los usuarios no suscritos ver una versión de demostración del dashboard
 */

// Función para renderizar el dashboard principal de Trader Call en modo vista previa
exports.previewTraderCallDashboard = (req, res) => {
    // Crear un usuario de demostración
    const demoUser = {
        nombre: 'Usuario Demo',
        email: 'demo@example.com',
        membresias: {
            servicios: 'trader-call',
            estado: 'activo'
        }
    };
    
    // Renderizar la vista con el usuario de demostración
    res.render('dashboard/trader-call/index', {
        user: demoUser,
        title: 'Vista Previa - Dashboard Trader Call',
        isAuthenticated: true,
        isPreview: true
    });
};

// Función para renderizar la página de seguimiento de alertas en modo vista previa
exports.previewTraderCallSeguimiento = (req, res) => {
    // Crear un usuario de demostración
    const demoUser = {
        nombre: 'Usuario Demo',
        email: 'demo@example.com',
        membresias: {
            servicios: 'trader-call',
            estado: 'activo'
        }
    };
    
    // Renderizar la vista con el usuario de demostración
    res.render('dashboard/trader-call/seguimiento', {
        user: demoUser,
        title: 'Vista Previa - Seguimiento de Alertas',
        isAuthenticated: true,
        isPreview: true
    });
};

// Función para renderizar la página de alertas vigentes en modo vista previa
exports.previewTraderCallAlertasVigentes = (req, res) => {
    // Crear un usuario de demostración
    const demoUser = {
        nombre: 'Usuario Demo',
        email: 'demo@example.com',
        membresias: {
            servicios: 'trader-call',
            estado: 'activo'
        }
    };
    
    // Renderizar la vista con el usuario de demostración
    res.render('dashboard/trader-call/alertas-vigentes', {
        user: demoUser,
        title: 'Vista Previa - Alertas Vigentes',
        isAuthenticated: true,
        isPreview: true
    });
};

// Función para renderizar la página de informes en modo vista previa
exports.previewTraderCallInformes = (req, res) => {
    // Crear un usuario de demostración
    const demoUser = {
        nombre: 'Usuario Demo',
        email: 'demo@example.com',
        membresias: {
            servicios: 'trader-call',
            estado: 'activo'
        }
    };
    
    // Renderizar la vista con el usuario de demostración
    res.render('dashboard/trader-call/informes', {
        user: demoUser,
        title: 'Vista Previa - Informes',
        isAuthenticated: true,
        isPreview: true
    });
};

// Función para renderizar la página de comunidad en modo vista previa
exports.previewTraderCallComunidad = (req, res) => {
    // Crear un usuario de demostración
    const demoUser = {
        nombre: 'Usuario Demo',
        email: 'demo@example.com',
        membresias: {
            servicios: 'trader-call',
            estado: 'activo'
        }
    };
    
    // Renderizar la vista con el usuario de demostración
    res.render('dashboard/trader-call/comunidad', {
        user: demoUser,
        title: 'Vista Previa - Comunidad',
        isAuthenticated: true,
        isPreview: true
    });
}; 