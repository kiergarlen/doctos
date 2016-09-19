const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercased: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Guest', 'Author', 'Admin'],
    default:  'Guest'
  },
  area: {
    type: String
  }
})

UserSchema.pre('save', function(next) {
  //var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        this.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = (pw, cb) => {
  bcrypt.compare(pw, this.password, (err, isMatch) => {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
