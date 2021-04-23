const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/User');
const Admin = require('./models/Admin');
const Collector = require('./models/Collector');
require('dotenv').config()

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.LOGIN_SECRET_KEY;



module.exports = passport => {
    passport.use(new JwtStrategy(opts, (payload, done) => {
        User.findOne({ _id: payload._id })
            .then(user => {
                if (!user) {

                    Collector.findOne({ _id: payload._id })
                        .then(collector => {
                            if (!collector) {
                                Admin.findOne({ _id: payload._id })
                                    .then(admin => {
                                        if (!admin) {
                                            return done(null, false);
                                        } else {
                                            return done(null, admin);
                                        }
                                    })
                                    .catch(error => {
                                        return done(error);
                                    })

                            } else {
                                return done(null, collector);
                            }
                        })
                        .catch(error => {
                            return done(error);
                        })


                } else {
                    return done(null, user);
                }
            })
            .catch(error => {
                return done(error);
            })
    }))
}