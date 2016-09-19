const mongoose = require('mongoose')

var StatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('status', StatusSchema, 'status')
