const mongoose = require('mongoose');
const Stats = require('../models/Stats');
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

async function cleanDuplicateStats() {
    try {
        await connectDB();
        
        // Obtener todas las estadísticas
        const allStats = await Stats.find().sort({ category: 1, order: 1 });
        
        console.log(`Total de estadísticas encontradas: ${allStats.length}`);
        
        // Mapa para rastrear órdenes únicos por categoría
        const uniqueOrders = {
            'landing': new Set(),
            'trader-call': new Set()
        };
        
        // IDs de estadísticas a mantener
        const keepIds = [];
        const duplicateIds = [];
        
        // Identificar estadísticas únicas y duplicadas
        for (const stat of allStats) {
            const category = stat.category || 'landing'; // Por defecto 'landing' si no tiene categoría
            
            if (!uniqueOrders[category].has(stat.order)) {
                uniqueOrders[category].add(stat.order);
                keepIds.push(stat._id);
                console.log(`Manteniendo: ${stat.value} - ${stat.text} (${category}, orden ${stat.order})`);
            } else {
                duplicateIds.push(stat._id);
                console.log(`Duplicado: ${stat.value} - ${stat.text} (${category}, orden ${stat.order})`);
            }
        }
        
        // Eliminar estadísticas duplicadas
        if (duplicateIds.length > 0) {
            const result = await Stats.deleteMany({ _id: { $in: duplicateIds } });
            console.log(`Se eliminaron ${result.deletedCount} estadísticas duplicadas`);
        } else {
            console.log('No se encontraron estadísticas duplicadas');
        }
        
        // Verificar resultado final
        const remainingStats = await Stats.find().sort({ category: 1, order: 1 });
        console.log(`Estadísticas restantes: ${remainingStats.length}`);
        
        // Mostrar estadísticas restantes
        console.log('\nEstadísticas restantes:');
        for (const stat of remainingStats) {
            console.log(`- ${stat.value} - ${stat.text} (${stat.category}, orden ${stat.order})`);
        }
        
        mongoose.disconnect();
        console.log('Proceso completado');
    } catch (error) {
        console.error('Error al limpiar estadísticas duplicadas:', error);
        mongoose.disconnect();
        process.exit(1);
    }
}

cleanDuplicateStats(); 