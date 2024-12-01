const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  id: { type: String, required: true },          // Natural key used by the UI
  subject: { type: String },                     // Subject of the message
  msgText: { type: String, required: true },     // Message text
  sender: { type: String } // Reference to Contact
});

module.exports = mongoose.model('Message', messageSchema);
