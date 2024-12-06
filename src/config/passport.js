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
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            // Manejo de apellido cuando no está disponible
            const apellido = profile.name.familyName || 'No especificado';
            
            user = await User.create({
                googleId: profile.id,
                nombre: profile.name.givenName || profile.displayName.split(' ')[0],
                apellido: apellido,
                email: profile.emails[0].value,
                authProvider: 'google'
            });
        }
        
        return done(null, user);
    } catch (err) {
        console.error('Error en autenticación de Google:', err);
        return done(err, null);
    }
})); 