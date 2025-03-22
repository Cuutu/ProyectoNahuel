const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

router.get('/dashboard', isAuthenticated, userController.getDashboard);

// Configurar multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile-images')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // límite de 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Solo se permiten imágenes!');
        }
    }
});

// Ruta para actualizar la foto de perfil
router.post('/api/user/profile-image', upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        const imageUrl = `/uploads/profile-images/${req.file.filename}`;
        
        // Actualizar la URL de la imagen en la base de datos
        await User.findByIdAndUpdate(req.user._id, {
            profileImage: imageUrl
        });

        res.json({ 
            success: true, 
            imageUrl: imageUrl 
        });
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar la foto de perfil' });
    }
});

module.exports = router; 