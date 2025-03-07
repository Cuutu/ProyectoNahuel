const ForumCategory = require('../models/ForumCategory');
const ForumTopic = require('../models/ForumTopic');
const ForumReply = require('../models/ForumReply');
const User = require('../models/User');

// Mostrar todas las categorías del foro
exports.getForumHome = async (req, res) => {
    try {
        const categories = await ForumCategory.find({ isActive: true }).sort('order');
        
        // Para cada categoría, obtener estadísticas
        const categoriesWithStats = await Promise.all(categories.map(async (category) => {
            const topicsCount = await ForumTopic.countDocuments({ category: category._id });
            
            // Obtener los temas más recientes
            const recentTopics = await ForumTopic.find({ category: category._id })
                .sort('-lastReplyDate')
                .limit(3)
                .populate('author', 'nombre apellido')
                .populate('lastReplyUser', 'nombre apellido');
            
            return {
                ...category.toObject(),
                topicsCount,
                recentTopics
            };
        }));
        
        res.render('dashboard/trader-call/comunidad', {
            title: 'Comunidad - Trader Call',
            user: req.user || req.session.user,
            isAuthenticated: true,
            activeTab: 'forum',
            categories: categoriesWithStats
        });
    } catch (error) {
        console.error('Error al cargar el foro:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el foro',
            user: req.user || req.session.user
        });
    }
};

// Mostrar una categoría específica con sus temas
exports.getCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await ForumCategory.findById(categoryId);
        
        if (!category) {
            return res.status(404).render('error', {
                message: 'Categoría no encontrada',
                user: req.user || req.session.user
            });
        }
        
        // Obtener todos los temas de esta categoría
        const topics = await ForumTopic.find({ category: categoryId })
            .sort({ isPinned: -1, lastReplyDate: -1 })
            .populate('author', 'nombre apellido')
            .populate('lastReplyUser', 'nombre apellido');
        
        // Para cada tema, obtener el número de respuestas
        const topicsWithReplies = await Promise.all(topics.map(async (topic) => {
            const repliesCount = await ForumReply.countDocuments({ topic: topic._id });
            return {
                ...topic.toObject(),
                repliesCount
            };
        }));
        
        res.render('dashboard/trader-call/forum/category', {
            title: `${category.name} - Foro Trader Call`,
            user: req.user || req.session.user,
            isAuthenticated: true,
            category,
            topics: topicsWithReplies
        });
    } catch (error) {
        console.error('Error al cargar la categoría:', error);
        res.status(500).render('error', {
            message: 'Error al cargar la categoría',
            user: req.user || req.session.user
        });
    }
};

// Mostrar un tema específico con sus respuestas
exports.getTopic = async (req, res) => {
    try {
        const topicId = req.params.topicId;
        
        // Incrementar el contador de vistas
        const topic = await ForumTopic.findByIdAndUpdate(
            topicId,
            { $inc: { views: 1 } },
            { new: true }
        )
        .populate('author', 'nombre apellido email')
        .populate('category');
        
        if (!topic) {
            return res.status(404).render('error', {
                message: 'Tema no encontrado',
                user: req.user || req.session.user
            });
        }
        
        // Obtener todas las respuestas de este tema
        const replies = await ForumReply.find({ topic: topicId })
            .sort('createdAt')
            .populate('author', 'nombre apellido email');
        
        // Obtener la categoría completa
        const category = topic.category;
        
        res.render('dashboard/trader-call/forum/topic', {
            title: topic.title,
            user: req.user || req.session.user,
            isAuthenticated: true,
            topic,
            category,
            replies
        });
    } catch (error) {
        console.error('Error al cargar el tema:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el tema',
            user: req.user || req.session.user
        });
    }
};

// Crear un nuevo tema
exports.createTopic = async (req, res) => {
    try {
        const { title, content, categoryId } = req.body;
        const userId = req.user?._id || req.session.user?._id;
        
        if (!title || !content || !categoryId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }
        
        const newTopic = new ForumTopic({
            title,
            content,
            author: userId,
            category: categoryId,
            lastReplyUser: userId
        });
        
        await newTopic.save();
        
        res.status(201).json({
            success: true,
            topicId: newTopic._id,
            message: 'Tema creado con éxito'
        });
    } catch (error) {
        console.error('Error al crear el tema:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el tema: ' + error.message
        });
    }
};

// Crear una nueva respuesta
exports.createReply = async (req, res) => {
    try {
        const { content, topicId } = req.body;
        const userId = req.user?._id || req.session.user?._id;
        
        if (!content || !topicId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos requeridos'
            });
        }
        
        // Verificar si el tema existe y no está bloqueado
        const topic = await ForumTopic.findById(topicId);
        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Tema no encontrado'
            });
        }
        
        if (topic.isLocked) {
            return res.status(403).json({
                success: false,
                message: 'Este tema está bloqueado y no permite nuevas respuestas'
            });
        }
        
        const newReply = new ForumReply({
            content,
            author: userId,
            topic: topicId
        });
        
        await newReply.save();
        
        // Obtener los datos del autor para la respuesta
        const author = await User.findById(userId, 'nombre apellido');
        
        res.status(201).json({
            success: true,
            reply: {
                ...newReply.toObject(),
                author
            }
        });
    } catch (error) {
        console.error('Error al crear la respuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la respuesta'
        });
    }
};

// Buscar en el foro
exports.searchForum = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere un término de búsqueda'
            });
        }
        
        // Buscar temas que coincidan con la consulta
        const topics = await ForumTopic.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        })
        .sort('-lastReplyDate')
        .limit(20)
        .populate('author', 'nombre apellido')
        .populate('category', 'name');
        
        // Buscar respuestas que coincidan con la consulta
        const replies = await ForumReply.find({
            content: { $regex: query, $options: 'i' }
        })
        .sort('-createdAt')
        .limit(20)
        .populate('author', 'nombre apellido')
        .populate('topic', 'title');
        
        res.json({
            success: true,
            results: {
                topics,
                replies
            }
        });
    } catch (error) {
        console.error('Error en la búsqueda del foro:', error);
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda'
        });
    }
}; 