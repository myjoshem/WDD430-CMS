const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  id: { type: String, required: true },          // Natural key used by the UI
  name: { type: String, required: true },       // Title of the document
  url: { type: String },                         // URL of the document
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }] // Array of related child documents
});

module.exports = mongoose.model('Document', documentSchema);
