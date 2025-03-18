const Cashflow = require('../models/Cashflow');

// Obtener datos del dashboard de Cashflow
exports.getDashboard = async (req, res) => {
    try {
        // Obtener estadísticas generales
        const entradasTotal = await Cashflow.aggregate([
            { $match: { tipoFlujo: 'entrada' } },
            { $group: { _id: null, total: { $sum: '$volumen' } } }
        ]);
        
        const salidasTotal = await Cashflow.aggregate([
            { $match: { tipoFlujo: 'salida' } },
            { $group: { _id: null, total: { $sum: '$volumen' } } }
        ]);
        
        // Calcular porcentajes
        const totalVolumen = (entradasTotal[0]?.total || 0) + (salidasTotal[0]?.total || 0);
        const porcentajeEntrada = totalVolumen ? Math.round((entradasTotal[0]?.total || 0) * 100 / totalVolumen) : 0;
        const porcentajeSalida = totalVolumen ? Math.round((salidasTotal[0]?.total || 0) * 100 / totalVolumen) : 0;
        
        // Calcular balance neto (cambio porcentual)
        const balanceNeto = porcentajeEntrada - porcentajeSalida;
        
        // Obtener principales entradas de capital
        const principalesEntradas = await Cashflow.find({ tipoFlujo: 'entrada' })
            .sort({ volumen: -1 })
            .limit(5);
            
        // Obtener principales salidas de capital
        const principalesSalidas = await Cashflow.find({ tipoFlujo: 'salida' })
            .sort({ volumen: -1 })
            .limit(5);
            
        // Obtener datos históricos para el gráfico (últimos 10 meses)
        const datosHistoricos = await Cashflow.aggregate([
            {
                $group: {
                    _id: { 
                        mes: { $month: "$fecha" },
                        año: { $year: "$fecha" },
                        tipoFlujo: "$tipoFlujo" 
                    },
                    total: { $sum: "$volumen" }
                }
            },
            { $sort: { "_id.año": 1, "_id.mes": 1 } },
            { $limit: 20 } // 10 meses * 2 tipos de flujo
        ]);
        
        // Formatear datos para el gráfico
        // ... (lógica de formato para Chart.js)
        
        // Renderizar vista con datos
        res.render('cashflow/index', {
            title: 'Cashflow Dashboard',
            user: req.user || req.session.user,
            activePage: 'cashflow',
            stats: {
                porcentajeEntrada,
                porcentajeSalida,
                balanceNeto
            },
            principalesEntradas,
            principalesSalidas,
            datosHistoricos
        });
        
    } catch (error) {
        console.error('Error al obtener datos de Cashflow:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el dashboard de Cashflow',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

// Crear nuevo registro de Cashflow
exports.crearRegistro = async (req, res) => {
    try {
        const {
            activo,
            mercado,
            tipoFlujo,
            volumen,
            cambio,
            indiceLiquidez,
            presionCompradora,
            presionVendedora,
            notas
        } = req.body;
        
        const nuevoRegistro = new Cashflow({
            activo,
            mercado,
            tipoFlujo,
            volumen,
            cambio,
            indiceLiquidez,
            presionCompradora,
            presionVendedora,
            notas,
            createdBy: req.user._id
        });
        
        await nuevoRegistro.save();
        
        res.redirect('/cashflow');
        
    } catch (error) {
        console.error('Error al crear registro de Cashflow:', error);
        res.status(500).render('error', {
            message: 'Error al crear registro de Cashflow',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
};

// Obtener datos para API
exports.getApiData = async (req, res) => {
    try {
        const { periodo } = req.query; // diario, semanal, mensual, anual
        
        // Lógica para filtrar por periodo
        let fechaInicio = new Date();
        switch(periodo) {
            case 'semanal':
                fechaInicio.setDate(fechaInicio.getDate() - 7);
                break;
            case 'mensual':
                fechaInicio.setMonth(fechaInicio.getMonth() - 1);
                break;
            case 'anual':
                fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
                break;
            default: // diario
                fechaInicio.setDate(fechaInicio.getDate() - 1);
        }
        
        const datos = await Cashflow.find({
            fecha: { $gte: fechaInicio }
        }).sort({ fecha: 1 });
        
        res.json(datos);
        
    } catch (error) {
        console.error('Error al obtener datos de API Cashflow:', error);
        res.status(500).json({ error: 'Error al obtener datos de Cashflow' });
    }
}; 