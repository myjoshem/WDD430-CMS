import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private dbUrl = 'http://localhost:3000/api/documents'; // Updated to match your backend API route
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  documents: Document[] = [];

  constructor(private http: HttpClient) {
    this.getDocuments(); // Fetch documents from the backend on service initialization
  }

  // Fetch all documents from the backend
  getDocuments() {
    this.http
      .get<{ message: string; documents: Document[] }>(this.dbUrl)
      .subscribe(
        (response) => {
          this.documents = response.documents || [];
          this.documents.sort((a, b) => +a.id - +b.id); // Sort documents by ID
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error) => {
          console.error('Error fetching documents:', error);
        }
      );
  }

  // Fetch a specific document by ID
  getDocument(id: string) {
    return this.http.get<Document>(`${this.dbUrl}/${id}`);
  }

// Add a new document
addDocument(newDocument: Document) {
  if (!newDocument) {
    return;
  }

  return this.http.post<{ message: string; document: Document }>(
    this.dbUrl,
    newDocument,
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
  );
}

 // Update an existing document
updateDocument(originalDocument: Document, updatedDocument: Document) {
  if (!originalDocument || !updatedDocument) {
    return;
  }

  return this.http.put<{ message: string }>(
    `${this.dbUrl}/${originalDocument.id}`,
    updatedDocument,
    {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }
  );
}
  // Delete a document
  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    this.http.delete(`${this.dbUrl}/${document.id}`).subscribe(
      () => {
        this.documents = this.documents.filter((doc) => doc.id !== document.id); // Remove the document from the local array
        this.documentListChangedEvent.next(this.documents.slice()); // Notify subscribers
      },
      (error) => {
        console.error('Error deleting document:', error);
      }
    );
  }
}
