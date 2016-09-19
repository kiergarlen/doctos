const mongoose = require('mongoose')

var ReceiverTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('receivertype', ReceiverTypeSchema, 'receiverTypes')
