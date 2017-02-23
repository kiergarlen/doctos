const mongoose = require('mongoose')

var DocumentSchema = new mongoose.Schema({
  number: {
    type: String,
    required: false
  },
  numberExecutiveOffice: {
    type: String,
    required: false
  },
  documentType: {
    type: String,
    required: true
  },
  consecutive: {
    type: Number,
    required: false
  },
  internalDepartment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  receiver: {
    type: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    }
  },
  url: {
    type: String,
    required: false
  },
  draftDate: {
    type: Date,
    default: Date.now
  },
  signDate: {
    type: Date,
    default: Date.now
  },
  sealDate: {
    type: Date,
    default: Date.now
  },
  hasDeadline: {
    type: Boolean,
    default: false
  },
  hoursUntilDeadline: {
    type: Number,
    required: false,
    default: 0
  },
  deadline: {
    type: Date,
    required: false
  },
  entryUser: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  reception: {
    controlNumber: {
      type: String,
      required: false
    },
    receptionDate: {
      type: Date,
      default: Date.now
    },
    office: {
      type: String,
      required: false
    },
    receptionist: {
      type: String,
      required: false
    },
    subject: {
      type: String,
      required: false
    },
    hasDeadline: {
      type: Boolean,
      default: false
    },
    hoursUntilDeadline: {
      type: Number,
      required: false,
      default: 0
    },
    deadline: {
      type: Date,
      required: false
    }
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

module.exports = mongoose.model('Doc', DocumentSchema)
