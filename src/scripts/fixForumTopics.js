const mongoose = require('mongoose');
require('dotenv').config();
const ForumTopic = require('../models/ForumTopic');
const ForumCategory = require('../models/ForumCategory');

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexión a MongoDB establecida'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Función para verificar y corregir los temas
async function fixForumTopics() {
    try {
        // Obtener todas las categorías
        const categories = await ForumCategory.find();
        console.log(`Encontradas ${categories.length} categorías`);
        
        // Obtener todos los temas
        const topics = await ForumTopic.find();
        console.log(`Encontrados ${topics.length} temas`);
        
        // Verificar cada tema
        for (const topic of topics) {
            console.log(`Verificando tema: ${topic.title} (ID: ${topic._id})`);
            
            // Verificar si la categoría existe
            const categoryExists = await ForumCategory.findById(topic.category);
            
            if (!categoryExists) {
                console.log(`La categoría del tema ${topic.title} no existe. Asignando a la primera categoría disponible.`);
                
                if (categories.length > 0) {
                    topic.category = categories[0]._id;
                    await topic.save();
                    console.log(`Tema ${topic.title} actualizado con la categoría ${categories[0].name}`);
                } else {
                    console.log(`No hay categorías disponibles para asignar al tema ${topic.title}`);
                }
            } else {
                console.log(`El tema ${topic.title} tiene la categoría ${categoryExists.name}`);
            }
        }
        
        console.log('Verificación y corrección de temas completada');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al verificar y corregir los temas:', error);
        mongoose.connection.close();
    }
}

// Ejecutar la función
fixForumTopics(); 