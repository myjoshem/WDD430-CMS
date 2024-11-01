import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService implements OnInit {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  private maxDocumentId: number;

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId(); // Initial setup
  }

  ngOnInit() {}

  // Method to return a copy of the documents array
  getDocuments(): Document[] {
    // Use the slice() method to return a copy of the documents array
    return this.documents.slice();
  }

  // Method to find a specific document by id
  getDocument(id: string): Document | null {
    // Ensure both id types match (e.g., converting document.id to string)
    const document = this.documents.find((d) => d.id.toString() === id);
    console.log('Documents Array:', this.documents);
    return document ? document : null; // Return the document or null if not found
  }

 getMaxId() {
  let maxId = 0;
  this.documents.forEach((doc) => {
    const currentId = parseInt(doc.id, 10);
    if(currentId > maxId) {
      maxId = currentId;
    }
  })
  return maxId;
 }

 addDocument(newDocument: Document) {
  if (!newDocument) {
    return;
  }
  // Optional: Recheck maxDocumentId if external modifications to documents are possible
  this.maxDocumentId = this.getMaxId();
  this.maxDocumentId++;
  newDocument.id = this.maxDocumentId.toString();
  
  this.documents.push(newDocument);
  const documentsListClone = this.documents.slice();
  this.documentListChangedEvent.next(documentsListClone);
}

//Function to update an existing document in the list
updateDocument(originalDocument: Document, newDocument: Document) {
  if(!originalDocument || !newDocument) {
    return;
  }
  const pos = this.documents.indexOf(originalDocument);
  if (pos < 0) {
    return;
  }
  newDocument.id = originalDocument.id// Preserve original document Id
  this.documents[pos] = newDocument;
  const documentsListClone = this.documents.slice();
  this.documentListChangedEvent.next(documentsListClone);
}

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
