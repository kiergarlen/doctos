var mongoose = require('mongoose');

var DocumentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  number: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
  receiver: {
    kind: {
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
  entryUser: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
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
});

module.exports = mongoose.model('Doc', DocumentSchema);
