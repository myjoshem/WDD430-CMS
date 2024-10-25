import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { findIndex } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements OnInit {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documents: Document [] = [];

  constructor() {
    this.documents = MOCKDOCUMENTS;
   }

  ngOnInit() {
      
  }

  // Method to return a copy of the documents array
getDocuments(): Document[] {
  // Use the slice() method to return a copy of the documents array
  return this.documents.slice();
}

// Method to find a specific document by id
getDocument(id: string): Document | null {
  // Ensure both id types match (e.g., converting document.id to string)
  const document = this.documents.find(d => d.id.toString() === id);
  console.log('Documents Array:', this.documents);
  return document ? document : null; // Return the document or null if not found
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
  this.documentChangedEvent.emit(this.documents.slice());
}
}
