const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
        ? 'https://tu-app-vercel.vercel.app/auth/google/callback'  // URL de producción
        : 'http://localhost:3000/auth/google/callback',            // URL de desarrollo
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        // Buscar si el usuario ya existe
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Si el usuario existe, actualizar información de Google
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
        }

        // Si no existe, crear nuevo usuario
        const newUser = await User.create({
            googleId: profile.id,
            nombre: profile.name.givenName,
            apellido: profile.name.familyName,
            email: profile.emails[0].value,
            password: 'google-auth', // Contraseña por defecto para usuarios de Google
            telefono: '' // Campo requerido pero vacío inicialmente
        });

        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
})); 