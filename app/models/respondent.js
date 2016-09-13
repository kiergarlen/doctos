var mongoose = require('mongoose');

var Respondent = new mongoose.Schema({
  officeId: {
    type: Number
  },
  areaId: {
    type: Number
  },
  categoryId: {
    type: Number
  },
  direction: {
    type: String,
    required: true
  },
  office: {
    type: String,
    required: true
  },
  manager: {
    employeeId: {
      type: Number
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    secondLastName: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    }
  }
});

module.exports = mongoose.model('respondent', Respondent);
