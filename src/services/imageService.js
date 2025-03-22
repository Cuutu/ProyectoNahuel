const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const stream = require('stream');

let bucket;

// Inicializar GridFS
mongoose.connection.once('open', () => {
    bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'profileImages'
    });
});

const imageService = {
    // Subir imagen
    uploadImage: async (file) => {
        return new Promise((resolve, reject) => {
            const writeStream = bucket.openUploadStream(file.originalname, {
                contentType: file.mimetype
            });

            const readStream = new stream.PassThrough();
            readStream.end(file.buffer);

            readStream.pipe(writeStream)
                .on('error', reject)
                .on('finish', () => resolve(writeStream.id));
        });
    },

    // Obtener imagen
    getImage: async (imageId) => {
        if (!imageId) return null;
        
        try {
            const file = await bucket.find({ _id: new mongoose.Types.ObjectId(imageId) }).next();
            if (!file) return null;

            return bucket.openDownloadStream(file._id);
        } catch (error) {
            console.error('Error al obtener imagen:', error);
            return null;
        }
    },

    // Eliminar imagen anterior
    deleteImage: async (imageId) => {
        if (!imageId) return;
        
        try {
            await bucket.delete(new mongoose.Types.ObjectId(imageId));
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
        }
    }
};

module.exports = imageService; 