const express = require('express');
const router = express.Router();
const Document = require('../models/document'); // Import your Mongoose model

// GET: Get all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find(); // Query all documents
    res.status(200).json(documents); // Return documents in JSON format
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents', error });
  }
});

// GET: Get a document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id); // Find document by ID
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error });
  }
});

// POST: Create a new document
router.post('/', async (req, res) => {
  const newDocument = new Document(req.body); // Create a new Document instance
  try {
    const savedDocument = await newDocument.save(); // Save document to database
    res.status(201).json(savedDocument); // Return the saved document
  } catch (error) {
    res.status(400).json({ message: 'Error creating document', error });
  }
});

// PUT: Update an existing document
router.put('/:id', async (req, res) => {
  try {
    const updatedDocument = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json(updatedDocument); // Return the updated document
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
});

// DELETE: Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const deletedDocument = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted', document: deletedDocument });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
});

module.exports = router;
