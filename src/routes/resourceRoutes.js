const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('resources/index', {
        title: 'Recursos de Trading',
        user: req.session.user,
        isAuthenticated: req.isAuthenticated(),
        resources: [
            {
                category: "E-books",
                items: [
                    {
                        title: "Guía Básica de Trading",
                        description: "Aprende los fundamentos del trading desde cero",
                        imageUrl: "https://via.placeholder.com/400x300?text=Guia+Basica+Trading",
                        downloadUrl: "#",
                        isPremium: false
                    },
                    {
                        title: "Estrategias Avanzadas",
                        description: "Técnicas profesionales de trading",
                        imageUrl: "https://via.placeholder.com/400x300?text=Estrategias+Avanzadas",
                        downloadUrl: "#",
                        isPremium: true
                    }
                ]
            },
            {
                category: "Plantillas",
                items: [
                    {
                        title: "Trading Journal",
                        description: "Plantilla para registro de operaciones",
                        imageUrl: "https://via.placeholder.com/400x300?text=Trading+Journal",
                        downloadUrl: "#",
                        isPremium: false
                    },
                    {
                        title: "Plan de Trading",
                        description: "Plantilla para crear tu plan de trading",
                        imageUrl: "https://via.placeholder.com/400x300?text=Plan+Trading",
                        downloadUrl: "#",
                        isPremium: true
                    }
                ]
            },
            {
                category: "Indicadores",
                items: [
                    {
                        title: "RSI Personalizado",
                        description: "Indicador RSI con alertas",
                        imageUrl: "https://via.placeholder.com/400x300?text=RSI+Personalizado",
                        downloadUrl: "#",
                        isPremium: true
                    }
                ]
            }
        ]
    });
});

module.exports = router; 