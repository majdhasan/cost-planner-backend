const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user.model");
const passport = require("passport");

module.exports = (passport) => {
  let config = {};
  config.secretOrKey = process.env.SECRET;
  config.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

  passport.use(
    new JwtStrategy(config, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
