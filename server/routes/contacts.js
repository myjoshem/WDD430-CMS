const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

// GET route to fetch all contacts with populated group arrays
router.get('/', async (req, res) => {
  try {
    // Step 1: Fetch all contacts in the database once and store them in memory
    const allContacts = await Contact.find();

    // Create a map for quick access to contacts by their _id
    const contactMap = {};
    allContacts.forEach((contact) => {
      contactMap[contact._id.toString()] = contact; // Ensure _id is treated as a string
    });

    // Step 2: Process each contact to populate its group array
    const populatedContacts = allContacts.map((contact) => {
      if (contact.group && contact.group.length > 0) {
        // Replace group strings with full contact objects using the map
        const populatedGroup = contact.group.map((groupId) => contactMap[groupId] || groupId);

        // Return the contact with the populated group array
        return { ...contact.toObject(), group: populatedGroup };
      }

      // Return the contact as-is if the group array is empty
      return contact.toObject();
    });

    // Step 3: Send the populated contacts as the response
    res.status(200).json(populatedContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

/* router.get('/', async (req, res) => {
  try {
    // Step 1: Get all contacts from the database
    const contacts = await Contact.find();

    // Step 2: Process each contact to populate its group array
    const populatedContacts = await Promise.all(
      contacts.map(async (contact) => {
        // If the group array is not empty
        if (contact.group && contact.group.length > 0) {
          // Create a new array where each group string is replaced with the full Contact object
          const populatedGroup = await Promise.all(
            contact.group.map(async (groupId) => {
              // Match each string in the group array to a Contact._id
              const matchedContact = await Contact.findOne({ _id: groupId });
              return matchedContact || groupId; // Return the matched Contact or the original string if no match is found
            })
          );

          // Return the contact with the populated group array
          return { ...contact.toObject(), group: populatedGroup };
        }

        // Return the contact as-is if the group array is empty
        return contact.toObject();
      })
    );

    // Step 3: Send the populated contacts as the response
    res.status(200).json(populatedContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});
 */

// POST: Add a new contact
router.post('/', (req, res, next) => {
  const maxContactId = sequenceGenerator.nextId('contacts');
  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group || [], // Accept optional group array
  });

  contact
    .save()
    .then((createdContact) => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occurred while adding the contact.',
        error: error,
      });
    });
});

// PUT: Update an existing contact
router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found.' });
      }

      // Update the contact's properties
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group || []; // Update group if provided

      return Contact.updateOne({ id: req.params.id }, contact);
    })
    .then(() => {
      res.status(204).json({
        message: 'Contact updated successfully',
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occurred while updating the contact.',
        error: error,
      });
    });
});

// DELETE: Remove a contact
router.delete('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found.' });
      }

      return Contact.deleteOne({ id: req.params.id });
    })
    .then(() => {
      res.status(204).json({
        message: 'Contact deleted successfully',
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'An error occurred while deleting the contact.',
        error: error,
      });
    });
});

module.exports = router;
