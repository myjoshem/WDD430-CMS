const Sequence = require('../models/sequence');

class SequenceGenerator {
  constructor() {
    this.maxDocumentId = 0;
    this.maxMessageId = 0;
    this.maxContactId = 0;

    this.loadSequence();
  }

  async loadSequence() {
    try {
      const sequence = await Sequence.findOne().exec(); // Fetch the sequence object

      if (sequence) {
        this.maxDocumentId = sequence.maxDocumentId;
        this.maxMessageId = sequence.maxMessageId;
        this.maxContactId = sequence.maxContactId;
      }
    } catch (error) {
      console.error('Error loading sequence:', error);
      throw new Error('Could not load sequence');
    }
  }

  nextId(collectionType) {
    if (collectionType === 'documents') {
      this.maxDocumentId++;
      return this.maxDocumentId.toString();
    } else if (collectionType === 'messages') {
      this.maxMessageId++;
      return this.maxMessageId.toString();
    } else if (collectionType === 'contacts') {
      this.maxContactId++;
      return this.maxContactId.toString();
    } else {
      throw new Error('Invalid collection type');
    }
  }
}

module.exports = new SequenceGenerator();
