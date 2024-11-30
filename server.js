const express = require('express');
const path = require('path');
const app = express();

// Configuración de archivos estáticos - usando la ruta correcta
app.use(express.static(path.join(__dirname, 'src/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Rutas
app.get('/', (req, res) => {
    res.render('landing', {
        title: "Domina el Trading y las Criptomonedas",
        description: "Aprende a generar ingresos en el mercado financiero con estrategias probadas y mentorías personalizadas",
        video: {
            id: "tu-id-de-youtube"
        },
        ctaButton: {
            url: "#unirme",
            text: "¡Unirme Ahora!"
        }
    });
});

const serviceRoutes = require('./src/routes/serviceRoutes');
const authRoutes = require('./src/routes/authRoutes');
const session = require('express-session');
const mongoose = require('mongoose');

// Configuración de MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu_secreto',
  resave: false,
  saveUninitialized: false
}));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', serviceRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 