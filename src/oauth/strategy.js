import { Strategy as OAuth2Strategy } from "passport-oauth2";
import passport from "passport";

class CustomOAuth2Strategy extends OAuth2Strategy {
    constructor(options, verify) {
        super(options, verify);
        this.registerURL = options.registerURL;
        this.loginURL = options.loginURL;
    }

    getRegisterURL(params) {
        const url = new URL(this.registerURL);
        Object.keys(params).forEach((key) => {
            url.searchParams.append(key, params[key]);
        });
        return url.toString();
    }
    
    getLoginURL(params) {
        const url = new URL(this.loginURL);
        Object.keys(params).forEach((key) => {
            url.searchParams.append(key, params[key]);
        });
        return url.toString();
    }
}

const strategy = new CustomOAuth2Strategy(
    {
        authorizationURL: 'https://auth-server-dr8r.onrender.com/authorize',
        tokenURL: 'https://auth-server-dr8r.onrender.com/token',
        registerURL: 'https://auth-server-dr8r.onrender.com/register',
        loginURL: 'https://auth-server-dr8r.onrender.com/login',
        clientID: 'my-client2',
        clientSecret: 'secret2',
        callbackURL: 'https://duarte-tomas-auth-server.onrender.com/auth/provider/callback',
        state: true,
        customHeaders: {
            Authorization: 'Basic ' + Buffer.from('my-client2:secret2').toString('base64')
        }
    },
    (accessToken, refreshToken, profile, cb) => {
        const user = { accessToken, refreshToken };
        return cb(null, user);
    }
);

export default strategy;

passport.use(strategy);