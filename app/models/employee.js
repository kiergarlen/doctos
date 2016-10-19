const mongoose = require('mongoose')

var Employee = new mongoose.Schema({
  employeeId: {
    type: Number
  },
  name: {
    type: String
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  secondLastName: {
    type: String
  },
  position: {
    type: String
  },
  areaId: {
    type: Number
  },
  officeId: {
    type: Number
  },
  categoryId: {
    type: Number
  },
  positionId: {
    type: Number
  },
  area: {
    type: String
  },
  office: {
    type: String
  },
  category: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  extension: {
    type: Number
  },
  webDirectory: {
    type: Number
  },
  receptionist: {
    type: Number
  }
})

module.exports = mongoose.model('employee', Employee)
