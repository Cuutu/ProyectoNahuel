const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('resources/index', {
        title: 'Recursos de Trading',
        user: res.locals.user,
        resources: [
            {
                category: "E-books",
                items: [
                    {
                        title: "Guía Básica de Trading",
                        description: "Aprende los fundamentos del trading desde cero",
                        imageUrl: "/images/resources/ebook-basic.jpg",
                        downloadUrl: "#",
                        isPremium: false
                    },
                    {
                        title: "Estrategias Avanzadas",
                        description: "Técnicas profesionales de trading",
                        imageUrl: "/images/resources/ebook-advanced.jpg",
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
                        imageUrl: "/images/resources/template-journal.jpg",
                        downloadUrl: "#",
                        isPremium: false
                    },
                    {
                        title: "Plan de Trading",
                        description: "Plantilla para crear tu plan de trading",
                        imageUrl: "/images/resources/template-plan.jpg",
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
                        imageUrl: "/images/resources/indicator-rsi.jpg",
                        downloadUrl: "#",
                        isPremium: true
                    }
                ]
            }
        ]
    });
});

module.exports = router; 