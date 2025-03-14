const Informe = require('../models/Informe');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuración de multer para manejar subidas de archivos
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB máximo
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'imagenFile') {
            // Verificar que sea una imagen
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Solo se permiten archivos de imagen'));
            }
        } else if (file.fieldname === 'videoFile') {
            // Verificar que sea un video
            if (!file.mimetype.startsWith('video/')) {
                return cb(new Error('Solo se permiten archivos de video'));
            }
        }
        cb(null, true);
    }
}).fields([
    { name: 'imagenFile', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 }
]);

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
exports.crearInforme = (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // Error de multer durante la subida
            return res.status(400).json({ error: `Error en la subida: ${err.message}` });
        } else if (err) {
            // Otro tipo de error
            return res.status(500).json({ error: `Error en el servidor: ${err.message}` });
        }
        
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
            
            // Procesar imagen subida
            if (req.files && req.files.imagenFile && req.files.imagenFile[0]) {
                const imagenFile = req.files.imagenFile[0];
                nuevoInforme.imagen = {
                    data: imagenFile.buffer,
                    contentType: imagenFile.mimetype,
                    filename: imagenFile.originalname
                };
            }
            
            // Procesar video subido
            if (req.files && req.files.videoFile && req.files.videoFile[0]) {
                const videoFile = req.files.videoFile[0];
                nuevoInforme.video = {
                    data: videoFile.buffer,
                    contentType: videoFile.mimetype,
                    filename: videoFile.originalname
                };
            }
            
            await nuevoInforme.save();
            res.redirect('/dashboard/trader-call/informes');
        } catch (error) {
            console.error('Error al crear informe:', error);
            res.status(500).send('Error al crear el informe');
        }
    });
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

// Servir imagen almacenada en la base de datos
exports.getImagen = async (req, res) => {
    try {
        const informe = await Informe.findById(req.params.id);
        if (!informe || !informe.imagen || !informe.imagen.data) {
            return res.status(404).send('Imagen no encontrada');
        }
        
        res.set('Content-Type', informe.imagen.contentType);
        res.send(informe.imagen.data);
    } catch (error) {
        console.error('Error al obtener imagen:', error);
        res.status(500).send('Error al obtener la imagen');
    }
};

// Servir video almacenado en la base de datos
exports.getVideo = async (req, res) => {
    try {
        const informe = await Informe.findById(req.params.id);
        if (!informe || !informe.video || !informe.video.data) {
            return res.status(404).send('Video no encontrado');
        }
        
        res.set('Content-Type', informe.video.contentType);
        res.send(informe.video.data);
    } catch (error) {
        console.error('Error al obtener video:', error);
        res.status(500).send('Error al obtener el video');
    }
}; 