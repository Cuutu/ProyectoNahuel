const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const imageService = require('../services/imageService');

router.get('/dashboard', isAuthenticated, userController.getDashboard);

// Configurar multer para memoria
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'));
        }
    }
});

// Ruta para obtener imagen de perfil
router.get('/api/user/profile-image/:id', async (req, res) => {
    try {
        const stream = await imageService.getImage(req.params.id);
        if (!stream) {
            return res.status(404).send('Imagen no encontrada');
        }

        res.set('Content-Type', 'image/jpeg');
        stream.pipe(res);
    } catch (error) {
        res.status(500).send('Error al obtener la imagen');
    }
});

// Ruta para actualizar foto de perfil
router.post('/api/user/profile-image', upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        const user = await User.findById(req.user._id);
        
        // Eliminar imagen anterior si existe
        if (user.profileImage) {
            await imageService.deleteImage(user.profileImage);
        }

        // Subir nueva imagen
        const imageId = await imageService.uploadImage(req.file);
        
        // Actualizar referencia en el usuario
        user.profileImage = imageId;
        await user.save();

        res.json({ 
            success: true, 
            imageUrl: `/api/user/profile-image/${imageId}`
        });
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar la foto de perfil' });
    }
});

module.exports = router; 
module.exports = router; 