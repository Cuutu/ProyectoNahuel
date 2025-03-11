const ForumCategory = require('../models/ForumCategory');
const ForumTopic = require('../models/ForumTopic');
const ForumReply = require('../models/ForumReply');
const User = require('../models/User');

// Mostrar todas las categorías del foro
exports.getForumHome = async (req, res) => {
    try {
        // Obtener categorías activas
        const categories = await ForumCategory.find({ isActive: true });
        
        // Obtener temas recientes (no eliminados)
        const recentTopics = await ForumTopic.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('author', 'nombre avatar')
            .populate('category', 'name');
        
        // Renderizar la vista con el título
        res.render('dashboard/trader-call/comunidad', {
            user: req.user || req.session.user,
            categories,
            recentTopics,
            title: 'Comunidad Trader Call'
        });
    } catch (error) {
        console.error('Error al obtener la página principal del foro:', error);
        res.status(500).render('error', {
            message: 'Error al cargar la página del foro',
            error: error,
            user: req.user || req.session.user
        });
    }
};

// Mostrar una categoría específica con sus temas
exports.getCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        // Obtener la categoría
        const category = await ForumCategory.findOne({ _id: categoryId, isActive: true });
        if (!category) {
            return res.status(404).render('error', {
                message: 'Categoría no encontrada',
                user: req.user || req.session.user,
                error: {}
            });
        }
        
        // Obtener los temas de la categoría (no eliminados)
        const topics = await ForumTopic.find({ 
            category: categoryId,
            isActive: true 
        })
        .sort({ createdAt: -1 })
        .populate('author', 'nombre avatar')
        .populate('lastReplyUser', 'nombre avatar');
        
        // Renderizar la vista
        res.render('dashboard/trader-call/forum/category', {
            user: req.user || req.session.user,
            category,
            topics
        });
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).render('error', {
            message: 'Error al cargar la categoría',
            error: error,
            user: req.user || req.session.user
        });
    }
};

// Mostrar un tema específico con sus respuestas
exports.getTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        
        // Obtener el tema
        const topic = await ForumTopic.findOne({ 
            _id: topicId,
            isActive: true 
        })
        .populate('author', 'nombre avatar')
        .populate('category', 'name');
        
        if (!topic) {
            return res.status(404).render('error', {
                message: 'Tema no encontrado',
                user: req.user || req.session.user,
                error: {}
            });
        }
        
        // Obtener las respuestas del tema (no eliminadas)
        const replies = await ForumReply.find({ 
            topic: topicId,
            isActive: true 
        })
        .sort({ createdAt: 1 })
        .populate('author', 'nombre avatar');
        
        // Incrementar el contador de vistas
        topic.views += 1;
        await topic.save();
        
        // Renderizar la vista
        res.render('dashboard/trader-call/forum/topic', {
            user: req.user || req.session.user,
            topic,
            replies
        });
    } catch (error) {
        console.error('Error al obtener el tema:', error);
        res.status(500).render('error', {
            message: 'Error al cargar el tema',
            error: error,
            user: req.user || req.session.user
        });
    }
};

// Crear un nuevo tema (versión simplificada)
exports.createTopic = async (req, res) => {
    try {
        console.log('Iniciando creación de tema');
        console.log('Datos recibidos:', req.body);
        
        const { title, content, categoryId } = req.body;
        const userId = req.user?._id || req.session.user?._id;
        
        console.log('Datos procesados:', {
            title,
            content: content ? `${content.substring(0, 50)}...` : 'No content',
            categoryId,
            userId
        });
        
        if (!title || !content || !categoryId || !userId) {
            return res.status(400).render('error', {
                message: 'Faltan datos requeridos',
                user: req.user || req.session.user
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
        
        console.log('Tema creado con éxito:', {
            id: newTopic._id,
            title: newTopic.title
        });
        
        // Redirigir al tema creado
        res.redirect(`/dashboard/trader-call/forum/topic/${newTopic._id}`);
    } catch (error) {
        console.error('Error al crear el tema:', error);
        res.status(500).render('error', {
            message: 'Error al crear el tema: ' + error.message,
            user: req.user || req.session.user
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

// Eliminar un tema (administradores o autor)
exports.deleteTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user?._id || req.session.user?._id;
        
        console.log(`Intentando eliminar tema ${topicId} por usuario ${userId}`);
        
        const topic = await ForumTopic.findById(topicId);
        if (!topic) {
            return res.status(404).json({
                success: false,
                message: 'Tema no encontrado'
            });
        }
        
        // Verificar si el usuario es administrador o autor
        const user = req.user || req.session.user;
        const isAdmin = user.role === 'admin';
        const isAuthor = topic.author.toString() === userId.toString();
        
        if (!isAdmin && !isAuthor) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar este tema'
            });
        }
        
        // Realizar eliminación lógica
        await topic.softDelete(userId);
        
        // También marcar como eliminadas todas las respuestas del tema
        await ForumReply.updateMany(
            { topic: topicId },
            { 
                isActive: false,
                deletedAt: new Date(),
                deletedBy: userId
            }
        );
        
        return res.json({
            success: true,
            message: 'Tema eliminado correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar tema:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar el tema: ' + error.message
        });
    }
};

// Eliminar una respuesta (administradores o autor)
exports.deleteReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const userId = req.user?._id || req.session.user?._id;
        
        console.log(`Intentando eliminar respuesta ${replyId} por usuario ${userId}`);
        
        const reply = await ForumReply.findById(replyId);
        if (!reply) {
            return res.status(404).json({
                success: false,
                message: 'Respuesta no encontrada'
            });
        }
        
        // Verificar si el usuario es administrador o autor
        const user = req.user || req.session.user;
        const isAdmin = user.role === 'admin';
        const isAuthor = reply.author.toString() === userId.toString();
        
        if (!isAdmin && !isAuthor) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar esta respuesta'
            });
        }
        
        // Realizar eliminación lógica
        await reply.softDelete(userId);
        
        return res.json({
            success: true,
            message: 'Respuesta eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar respuesta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar la respuesta: ' + error.message
        });
    }
};

// Crear una nueva categoría (solo administradores)
exports.createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;
        
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y la descripción son obligatorios'
            });
        }
        
        const newCategory = new ForumCategory({
            name,
            description,
            icon: icon || 'fas fa-comments'
        });
        
        await newCategory.save();
        
        return res.json({
            success: true,
            message: 'Categoría creada correctamente',
            category: newCategory
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al crear la categoría: ' + error.message
        });
    }
}; 