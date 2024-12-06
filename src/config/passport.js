const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    console.log('Serializando usuario:', user._id);
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializando usuario ID:', id);
        const user = await User.findById(id).select('-password');
        if (!user) {
            console.log('Usuario no encontrado en deserialización');
            return done(null, false);
        }
        console.log('Usuario deserializado:', user.email);
        done(null, user);
    } catch (err) {
        console.error('Error en deserialización:', err);
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Perfil de Google recibido:', profile.id);
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            console.log('Creando nuevo usuario');
            const fullName = profile.displayName.split(' ');
            user = await User.create({
                googleId: profile.id,
                nombre: fullName[0],
                apellido: fullName.slice(1).join(' ') || 'No especificado',
                email: profile.emails[0].value,
                authProvider: 'google'
            });
        } else {
            console.log('Usuario existente encontrado');
            if (!user.googleId) {
                user.googleId = profile.id;
                user.authProvider = 'google';
                await user.save();
            }
        }
        
        return done(null, user);
    } catch (err) {
        console.error('Error en estrategia de Google:', err);
        return done(err, null);
    }
})); 