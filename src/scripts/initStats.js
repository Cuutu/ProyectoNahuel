const mongoose = require('mongoose');
const Stats = require('../models/Stats');
require('dotenv').config();

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Datos iniciales
const initialStats = [
    {
        value: '7 años',
        text: 'trabajando con el mercado',
        order: 1
    },
    {
        value: '+1500',
        text: 'alumnos',
        order: 2
    },
    {
        value: '+300',
        text: 'horas de formación',
        order: 3
    }
];

// Función para inicializar los datos
async function initStats() {
    try {
        // Verificar si ya existen estadísticas
        const count = await Stats.countDocuments();
        
        if (count === 0) {
            // Si no hay estadísticas, insertar las iniciales
            await Stats.insertMany(initialStats);
            console.log('Estadísticas inicializadas correctamente');
        } else {
            console.log('Ya existen estadísticas en la base de datos');
        }
        
        // Mostrar las estadísticas actuales
        const stats = await Stats.find().sort('order');
        console.log('Estadísticas actuales:', stats);
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error al inicializar estadísticas:', error);
        mongoose.disconnect();
    }
}

// Ejecutar la función
initStats(); 