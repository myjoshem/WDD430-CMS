require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Message = require('../server/models/message');
const Contact = require('../server/models/contact');

const MONGO_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cms';

// Connect to MongoDB
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    return runTests(); // Call your test functions here
  })
  .catch((err) => console.error('MongoDB connection error:', err))
  .finally(() => mongoose.disconnect()); // Disconnect when done

async function runTests() {
  try {
    // Create a sample contact
    const contact = new Contact({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      imageUrl: 'http://example.com/image.jpg'
    });
    await contact.save();
    console.log('Contact saved:', contact);

    // Create a sample message
    const message = new Message({
      id: '101',
      subject: 'Test Message',
      msgText: 'This is a test message',
      sender: contact._id
    });
    await message.save();
    console.log('Message saved:', message);

    // Fetch and display saved data
    const messages = await Message.find().populate('sender');
    console.log('Messages:', messages);
  } catch (error) {
    console.error('Test error:', error);
  }
}
