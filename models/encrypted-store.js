const mongoose = require('mongoose');

const encryptedMessageSchema = new mongoose.Schema({
  senderId : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
  },
  indices: {
    type: [[Number]], 
    required: true
  },
  encryptedText: {
    type: String,
    required: true 
  },
  receivers: [{
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    key: {
      type: String, 
      required: true 
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EncryptedMessage = mongoose.model('EncryptedMessage', encryptedMessageSchema);

module.exports = EncryptedMessage;
