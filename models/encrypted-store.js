const mongoose = require('mongoose');

const encryptedMessageSchema = new mongoose.Schema({
  encryptedText: {
    type: String,  
    required: true
  },
  key: {
    type: String,  
    required: true
  },
  indices: {
    type: [[Number]],  
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const EncryptedMessage = mongoose.model('EncryptedMessage', encryptedMessageSchema);

module.exports = EncryptedMessage;
