const ForumCategory = require('../models/ForumCategory');
const ForumTopic = require('../models/ForumTopic');
const ForumReply = require('../models/ForumReply');
const User = require('../models/User');

// Mostrar todas las categorías del foro
exports.getForumHome = async (req, res) => {
    try {
        console.log('Cargando página principal del foro');
        
        // Obtener todas las categorías (sin filtrar por isActive por ahora)
        const categories = await ForumCategory.find();
        
        console.log(`Se encontraron ${categories.length} categorías`);
        
        // Imprimir información de depuración sobre las categorías
        categories.forEach((category, index) => {
            console.log(`Categoría ${index + 1}: ID=${category._id}, Nombre=${category.name}`);
        });
        
        // Obtener temas recientes (sin filtrar por isActive por ahora)
        const recentTopics = await ForumTopic.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('author', 'nombre avatar')
            .populate('category', 'name');
        
        console.log(`Se encontraron ${recentTopics.length} temas recientes`);
        
        // Renderizar la vista
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
        
        console.log(`Buscando temas para la categoría: ${categoryId}`);
        
        // Obtener la categoría
        const category = await ForumCategory.findById(categoryId);
        if (!category) {
            return res.status(404).render('error', {
                message: 'Categoría no encontrada',
                user: req.user || req.session.user,
                error: {}
            });
        }
        
        // Obtener los temas de la categoría SIN filtrar por isActive por ahora
        const topics = await ForumTopic.find({ 
            category: categoryId
            // Temporalmente quitamos el filtro isActive para ver todos los temas
        })
        .sort({ createdAt: -1 })
        .populate('author', 'nombre avatar')
        .populate('lastReplyUser', 'nombre avatar');
        
        console.log(`Se encontraron ${topics.length} temas para la categoría ${category.name}`);
        
        // Imprimir información de depuración sobre los temas
        topics.forEach((topic, index) => {
            console.log(`Tema ${index + 1}: ID=${topic._id}, Título=${topic.title}, Autor=${topic.author?.nombre || 'N/A'}, Categoría=${topic.category}`);
        });
        
        // Renderizar la vista
        res.render('dashboard/trader-call/forum/category', {
            user: req.user || req.session.user,
            category,
            topics,
            title: `Categoría: ${category.name}`
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
        
        // Obtener la categoría completa
        const category = await ForumCategory.findById(topic.category._id);
        
        // Obtener todas las categorías para el selector
        const categories = await ForumCategory.find({ isActive: true });
        
        // Obtener las respuestas del tema
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
            replies,
            category,
            categories,
            title: topic.title
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
                user: req.user || req.session.user,
                error: {}
            });
        }
        
        // Verificar que la categoría existe
        const category = await ForumCategory.findById(categoryId);
        if (!category) {
            return res.status(404).render('error', {
                message: 'Categoría no encontrada',
                user: req.user || req.session.user,
                error: {}
            });
        }
        
        const newTopic = new ForumTopic({
            title,
            content,
            author: userId,
            category: categoryId,
            lastReplyUser: userId,
            lastReplyDate: new Date()
        });
        
        await newTopic.save();
        
        console.log('Tema creado con éxito:', {
            id: newTopic._id,
            title: newTopic.title,
            category: categoryId
        });
        
        // Redirigir al tema creado
        res.redirect(`/dashboard/trader-call/forum/topic/${newTopic._id}`);
    } catch (error) {
        console.error('Error al crear el tema:', error);
        res.status(500).render('error', {
            message: 'Error al crear el tema: ' + error.message,
            user: req.user || req.session.user,
            error: error
        });
    }
};

// Crear una nueva respuesta
exports.createReply = async (req, res) => {
    try {
        console.log('Iniciando creación de respuesta');
        console.log('Datos recibidos:', req.body);
        
        const { topicId, content } = req.body;
        const userId = req.user?._id || req.session.user?._id;
        
        console.log('Datos procesados:', {
            topicId,
            content: content ? `${content.substring(0, 50)}...` : 'No content',
            userId
        });
        
        if (!topicId || !content || !userId) {
            return res.status(400).render('error', {
                message: 'Faltan datos requeridos',
                user: req.user || req.session.user,
                error: {}
            });
        }
        
        // Verificar que el tema existe
        const topic = await ForumTopic.findById(topicId);
        if (!topic) {
            return res.status(404).render('error', {
                message: 'Tema no encontrado',
                user: req.user || req.session.user,
                error: {}
            });
        }
        
        // Crear la nueva respuesta
        const newReply = new ForumReply({
            content,
            author: userId,
            topic: topicId
        });
        
        await newReply.save();
        
        console.log('Respuesta creada con éxito:', {
            id: newReply._id,
            topicId
        });
        
        // Actualizar el tema con la información de la última respuesta
        topic.lastReplyUser = userId;
        topic.lastReplyDate = new Date();
        topic.replyCount = (topic.replyCount || 0) + 1;
        await topic.save();
        
        // Redirigir al tema
        res.redirect(`/dashboard/trader-call/forum/topic/${topicId}`);
    } catch (error) {
        console.error('Error al crear la respuesta:', error);
        res.status(500).render('error', {
            message: 'Error al crear la respuesta: ' + error.message,
            user: req.user || req.session.user,
            error: error
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