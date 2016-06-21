var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: false
  },
  entryUser: {
    type: String,
    required: false
  },
  reception: {
    controlNumber: {
      type: String,
      required: false
    },
    date: {
      type: Date,
      default: Date.now
    },
    office: {
      type: String,
      required: false
    },
    receptionist: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: false
    },
    subject: {
      type: String,
      required: true
    },
    contents: {
      type: String,
      required: false
    }
  },
  response: {
    date: {
      type: Date,
      default: Date.now
    },
    number: {
      type: String,
      required: false
    },
    senderOrganization: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    }
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Doc', DocumentSchema);
