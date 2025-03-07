const mongoose = require('mongoose');
require('dotenv').config();
const ForumCategory = require('../models/ForumCategory');

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conexión a MongoDB establecida'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Categorías iniciales
const initialCategories = [
    {
        name: 'Anuncios',
        description: 'Anuncios oficiales y noticias importantes sobre Trader Call.',
        icon: 'fa-bullhorn',
        order: 1
    },
    {
        name: 'Análisis Técnico',
        description: 'Discusiones sobre análisis técnico, patrones de gráficos y estrategias.',
        icon: 'fa-chart-line',
        order: 2
    },
    {
        name: 'Alertas de Trading',
        description: 'Discusión sobre las alertas enviadas y resultados obtenidos.',
        icon: 'fa-bell',
        order: 3
    },
    {
        name: 'Estrategias de Trading',
        description: 'Comparte y discute diferentes estrategias de trading.',
        icon: 'fa-lightbulb',
        order: 4
    },
    {
        name: 'Preguntas y Respuestas',
        description: 'Espacio para hacer preguntas y obtener ayuda de la comunidad.',
        icon: 'fa-question-circle',
        order: 5
    },
    {
        name: 'Presentaciones',
        description: 'Preséntate a la comunidad y conoce a otros traders.',
        icon: 'fa-user-plus',
        order: 6
    }
];

// Función para inicializar las categorías
async function initCategories() {
    try {
        // Verificar si ya existen categorías
        const count = await ForumCategory.countDocuments();
        
        if (count === 0) {
            // Si no hay categorías, crear las iniciales
            await ForumCategory.insertMany(initialCategories);
            console.log('Categorías iniciales creadas con éxito');
        } else {
            console.log(`Ya existen ${count} categorías en la base de datos`);
        }
        
        // Mostrar las categorías existentes
        const categories = await ForumCategory.find().sort('order');
        console.log('Categorías del foro:');
        categories.forEach(cat => {
            console.log(`- ${cat.name} (${cat.description})`);
        });
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error al inicializar las categorías:', error);
        mongoose.connection.close();
    }
}

// Ejecutar la función
initCategories(); 