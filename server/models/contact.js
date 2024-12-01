const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  id: { type: String, required: true },          // Natural key used by the UI
  name: { type: String, required: true },        // Name of the contact
  email: { type: String, required: true },                       // Email address of the contact
  phone: { type: String, required: true },                       // Phone number of the contact
  imageUrl: { type: String },                    // Image URL for the contact
  group: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }] // Array of references to Contact objects
});

module.exports = mongoose.model('Contact', contactSchema);
