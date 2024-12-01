const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

// GET: Retrieve all documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json({
      message: 'Documents fetched successfully!',
      documents: documents,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while fetching documents.',
      error: error,
    });
  }
});

// GET: Retrieve a single document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findOne({ id: req.params.id }); // Find document by its 'id'
    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while fetching the document.',
      error: error,
    });
  }
});


// POST: Add a new document
router.post('/', async (req, res) => {
  try {
    const maxDocumentId = sequenceGenerator.nextId('documents');
    const document = new Document({
      id: maxDocumentId,
      name: req.body.name,
      url: req.body.url,
      children: req.body.children || [], // Optional: Accept children if provided
    });

    const createdDocument = await document.save();
    res.status(201).json({
      message: 'Document added successfully',
      document: createdDocument,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while adding the document.',
      error: error,
    });
  }
});

// PUT: Update an existing document
router.put('/:id', async (req, res) => {
  try {
    const document = await Document.findOne({ id: req.params.id });

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    document.name = req.body.name;
    document.url = req.body.url;
    document.children = req.body.children || []; // Update children if provided

    const updatedDocument = await Document.updateOne({ id: req.params.id }, document);
    res.status(204).json({
      message: 'Document updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating the document.',
      error: error,
    });
  }
});

// DELETE: Remove a document
router.delete('/:id', async (req, res) => {
  try {
    const document = await Document.findOne({ id: req.params.id });

    if (!document) {
      return res.status(404).json({ message: 'Document not found.' });
    }

    await Document.deleteOne({ id: req.params.id });
    res.status(204).json({
      message: 'Document deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while deleting the document.',
      error: error,
    });
  }
});

module.exports = router;
