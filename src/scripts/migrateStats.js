const mongoose = require('mongoose');
const Stats = require('../models/Stats');
const TraderCallStats = require('../models/TraderCallStats');
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

async function migrateStats() {
    try {
        await connectDB();
        
        // Obtener todas las estadísticas de TraderCallStats
        const traderCallStats = await TraderCallStats.find();
        
        console.log(`Encontradas ${traderCallStats.length} estadísticas de Trader Call para migrar`);
        
        // Migrar cada estadística a Stats
        for (const stat of traderCallStats) {
            await Stats.create({
                value: stat.value,
                text: stat.label,
                order: stat.order,
                visible: stat.visible,
                category: 'trader-call'
            });
            console.log(`Migrada estadística: ${stat.value} - ${stat.label}`);
        }
        
        console.log('Migración completada');
        
        // Verificar resultado
        const landingStats = await Stats.find({ category: 'landing' });
        const migratedStats = await Stats.find({ category: 'trader-call' });
        
        console.log(`Estadísticas de landing: ${landingStats.length}`);
        console.log(`Estadísticas de trader-call: ${migratedStats.length}`);
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error en la migración:', error);
        mongoose.disconnect();
        process.exit(1);
    }
}

migrateStats(); 