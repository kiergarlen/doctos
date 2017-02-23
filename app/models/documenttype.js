const mongoose = require('mongoose')

var DocumentTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('documenttype', DocumentTypeSchema, 'documentTypes')
