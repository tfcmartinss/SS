import express from "express";
import dotenv from "dotenv";

dotenv.config();

import passport from "passport";
import session from "express-session";
import strategy from "./oauth/strategy.js";
import verifyToken from "./middlewares/authMiddleware.js";

const app = express();
app.use(express.json());

app.use(session({
    secret: "your-secret-key",
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.accessToken);
});

passport.deserializeUser((accessToken, done) => {
    done(null, { accessToken });
});

app.get('/auth/register', (req, res) => {
    const registerURL = strategy.getRegisterURL({
        client_id: strategy._oauth2._clientId
    });
    res.redirect(registerURL);
});

app.get('/auth/login', (req, res) => {
    const registerURL = strategy.getLoginURL({
        client_id: strategy._oauth2._clientId
    });
    res.redirect(registerURL);
});

app.get('/auth/provider', verifyToken, passport.authenticate('oauth2'));

app.get('/auth/provider/callback', 
    passport.authenticate('oauth2', {
        successRedirect: '/done',
        failureRedirect: '/auth/provider/failure'
    })
);

app.get('/auth/provider/failure', (req, res) => {
    res.send('Failed to authenticate.');
});

app.get('/done', (req, res) => {
    if (req.user && req.user.accessToken) {
        res.send(`Hello, your access token is: ${req.user.accessToken}`);
    } else {
        res.send('No user is logged in.');
    }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});