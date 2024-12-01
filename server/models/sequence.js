const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
  maxDocumentId: { type: Number, required: true }, // Tracks the max ID for documents
  maxMessageId: { type: Number, required: true },  // Tracks the max ID for messages
  maxContactId: { type: Number, required: true }   // Tracks the max ID for contacts
});

module.exports = mongoose.model('Sequence', sequenceSchema);
