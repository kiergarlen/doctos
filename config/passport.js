const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../app/models/user')
const config = require('../config/config')

module.exports = (passport) => {
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
  opts.secretOrKey = config.secret
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      User.findOne({id: jwt_payload.id}, (err, user) => {
          if (err) {
            return done(err, false)
          }
          if (user) {
            done(null, user)
          } else {
            done(null, false)
          }
        }
      )
    })
  )
}
