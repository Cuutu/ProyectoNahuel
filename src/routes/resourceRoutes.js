const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('resources/index', {
        title: 'Recursos de Trading',
        user: req.session.user,
        isAuthenticated: req.isAuthenticated(),
        resources: [
            {
                category: "Recursos Esenciales",
                items: [
                    {
                        title: "El aliado que necesitas",
                        description: "La plataforma más completa para el análisis técnico y trading profesional.<br>¡Comienza a utilizar TradingView con 15 U$D de descuento!",
                        imageUrl: "https://i.imgur.com/b8mNsXs.png",
                        downloadUrl: "https://es.tradingview.com/pricing/?share_your_love=XTrader95",
                        isPremium: false,
                        buttonText: "Ir a Trading View"
                    },
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
                category: "Fórmulas TradingView",
                items: [
                    {
                        title: "Activos de USA",
                        description: "Los activos de USA que utilizo para realizar mis análisis.",
                        imageUrl: "https://www.shutterstock.com/image-photo/stacking-gold-bars-usa-flag-600nw-2533869475.jpg",
                        downloadUrl: "https://es.tradingview.com/watchlists/18037471/",
                        isPremium: false,
                        buttonText: "Abrir Watchlist"
                    },
                    {
                        title: "Activos de ARG",
                        description: "Los activos de ARG que utilizo para realizar mis análisis.",
                        imageUrl: "https://i0.wp.com/criptotendencia.com/wp-content/uploads/2024/06/Argentina-Sigue-disponible-el-Registro-de-Proveedores-de-Servicios-de-Activos-Virtuales.jpg?resize=696%2C398&ssl=1.jpg",
                        downloadUrl: "https://es.tradingview.com/watchlists/121047136/",
                        isPremium: false,
                        buttonText: "Abrir Watchlist"
                    },
                    {
                        title: "Índices que utilizo",
                        description: "Aqui encontras los índices que utilizo para realizar mis análisis.",
                        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0TWj5srvsRya0t_EhoJn6xISutYeEAnNNEQ&s.jpg",
                        isPremium: false,
                        buttonText: "Ver índices"
                    }
                ]
            },
            {
                category: "Links IMPORTANTES",
                items: [
                    {
                        title: "Calendarios",
                        description: "Acá encontraras los calendarios sobre la inflación de USA, la FED de USA y los balances.",
                        imageUrl: "https://media.istockphoto.com/id/1212381977/es/vector/icono-de-calendario-de-dise%C3%B1o-plano-simple.jpg?s=612x612&w=0&k=20&c=rH2qnbNgiZIKp2fghqjhLUr7r97KTgCheIoVuFUmKEY=.jpg",
                        downloadUrl: "#",
                        isPremium: false
                    },
                    {
                        title: "Calculadora CEDEARS",
                        description: "Acá podras calcular el precio de los CEDEARs.",
                        imageUrl: "https://academiasimple.com/wp-content/uploads/2020/08/cedears.jpg",
                        downloadUrl: "https://docs.google.com/spreadsheets/d/17H8-_IUFi5Pbl4S9kWwKc0iiH0w7dlpJeoORb8rv85E/edit?usp=sharing",
                        isPremium: false
                    }
                ]
            }
        ]
    });
});

module.exports = router; 