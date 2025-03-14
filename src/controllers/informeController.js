const Informe = require('../models/Informe');

// Obtener todos los informes
exports.getInformes = async (req, res) => {
    try {
        const informes = await Informe.find().sort({ fechaPublicacion: -1 });
        res.render('dashboard/trader-call/informes', {
            user: req.user,
            currentPath: req.path,
            title: 'Informes - Trader Call',
            informes
        });
    } catch (error) {
        console.error('Error al obtener informes:', error);
        res.status(500).send('Error al cargar los informes');
    }
};

// Mostrar formulario para crear informe
exports.mostrarFormularioCrear = (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.redirect('/dashboard/trader-call/informes');
    }
    
    res.render('dashboard/trader-call/crear-informe', {
        user: req.user,
        currentPath: req.path,
        title: 'Crear Informe - Trader Call'
    });
};

// Crear nuevo informe
exports.crearInforme = async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'No autorizado' });
    }
    
    try {
        const { titulo, contenido, imagenUrl, videoUrl, fuentes, destacado } = req.body;
        
        const nuevoInforme = new Informe({
            titulo,
            contenido,
            imagenUrl,
            videoUrl,
            fuentes,
            autor: req.user.name || 'Administrador',
            destacado: destacado === 'on'
        });
        
        await nuevoInforme.save();
        res.redirect('/dashboard/trader-call/informes');
    } catch (error) {
        console.error('Error al crear informe:', error);
        res.status(500).send('Error al crear el informe');
    }
};

// Eliminar informe
exports.eliminarInforme = async (req, res) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'No autorizado' });
    }
    
    try {
        await Informe.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard/trader-call/informes');
    } catch (error) {
        console.error('Error al eliminar informe:', error);
        res.status(500).send('Error al eliminar el informe');
    }
}; 