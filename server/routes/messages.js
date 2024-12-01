const express = require('express');
const router = express.Router();
const Message = require('../models/message'); // Import the Message model
const Contact = require('../models/contact'); // Import the Contact model
const sequenceGenerator = require('./sequenceGenerator');

// GET: Retrieve all messages
router.get('/', async (req, res) => {
  try {
    // Step 1: Fetch all contacts and store them in memory
    const allContacts = await Contact.find();

    // Create a map for quick access to contact names by their id
    const contactMap = {};
    allContacts.forEach((contact) => {
      contactMap[contact.id] = contact.name; // Map contact.id to contact.name
    });

    // Step 2: Fetch all messages
    const messages = await Message.find();

    // Step 3: Populate the sender field in each message using the contact map
    const populatedMessages = messages.map((message) => {
      const senderName = contactMap[message.sender] || null; // Match sender to contact.id and get contact.name

      return { ...message.toObject(), sender: senderName }; // Replace sender with the name
    });

    // Step 4: Send the populated messages as the response
    res.status(200).json({
      message: 'Messages fetched successfully!',
      messages: populatedMessages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      message: 'An error occurred while fetching messages.',
      error: error,
    });
  }
});


// POST: Add a new message
router.post('/', async (req, res) => {
  try {
    const maxMessageId = sequenceGenerator.nextId('messages');
    const message = new Message({
      id: maxMessageId, // Unique id for the new message
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender, // Expect the sender to be the Contact's id
    });

    const createdMessage = await message.save();
    res.status(201).json({
      message: 'Message added successfully',
      createdMessage: createdMessage,
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      message: 'An error occurred while adding the message.',
      error: error,
    });
  }
});

// PUT: Update an existing message
router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    // Update message fields
    message.subject = req.body.subject;
    message.msgText = req.body.msgText;
    message.sender = req.body.sender;

    // Save the updated message
    await message.save();

    // Send a success response
    res.status(200).json({
      message: 'Message updated successfully',
      updatedMessage: message, // Optional: include the updated message in the response
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      message: 'An error occurred while updating the message.',
      error: error,
    });
  }
});

// DELETE: Remove a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findOne({ id: req.params.id });

    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    await Message.deleteOne({ id: req.params.id });
    res.status(204).json({
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      message: 'An error occurred while deleting the message.',
      error: error,
    });
  }
});

module.exports = router;
