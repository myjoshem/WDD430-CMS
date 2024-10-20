import { Injectable, OnInit, EventEmitter } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements OnInit {
  documentSelectedEvent = new EventEmitter<Document>();
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
  // Use the find() method to search for the document with the matching id
  const document = this.documents.find(d => d.id === id);
  return document ? document : null; // Return the document or null if not found
}

}
