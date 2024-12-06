const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            const fullName = profile.displayName.split(' ');
            const nombre = fullName[0];
            const apellido = fullName.slice(1).join(' ') || 'No especificado';
            
            user = await User.create({
                googleId: profile.id,
                nombre: nombre,
                apellido: apellido,
                email: profile.emails[0].value,
                password: 'google-auth',
                telefono: '',
                authProvider: 'google'
            });
        } else if (!user.googleId) {
            user.googleId = profile.id;
            user.authProvider = 'google';
            await user.save();
        }
        
        return done(null, user);
    } catch (err) {
        console.error('Error en autenticación de Google:', err);
        return done(err, null);
    }
})); 