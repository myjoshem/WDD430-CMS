import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private firebaseUrl =
    'https://cmsproject-fall2024-default-rtdb.firebaseio.com/documents.json';
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new BehaviorSubject<Document[]>([]);
  documents: Document[] = [];
  private maxDocumentId: number = 0;

  constructor(private http: HttpClient) {
    this.getDocuments(); // Fetch documents from Firebase
  }

  //store documents on Firebase
  storeDocuments(documents: Document[]): void {
    //store headers in a new header object
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    //put header object into a variable
    const httpOptions = { headers };

    //send changes to documents array to database
    this.http
      .put<Document[]>(this.firebaseUrl, documents, httpOptions)
      .subscribe();
    this.setDocuments(documents);
  }

  // Fetch documents from Firebase
  getDocuments() {
    this.http
      .get<Document[]>(this.firebaseUrl)
      .pipe(
        tap((documents) => {
          this.setDocuments(documents || []);
        })
      )
      .subscribe(
        //Success method
        (updatedDocuments: Document[]) => {
          this.documents = updatedDocuments.sort((a, b) => +a.id - +b.id);

          this.maxDocumentId = this.getMaxId();
          this.documentListChangedEvent.next(this.documents.slice());
        },
        // Error method
        (error: any) => {
          console.error('Error getting documents:', error);
        }
      );
  }

  // Find a specific document by ID
  getDocument(id: string): Document | null {
    return this.documents.find((doc) => doc.id.toString() === id) || null;
  }

  // Find the maximum ID
  getMaxId() {
    let maxId = 0;
    this.documents.forEach((doc) => {
      const currentId =
        typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  // Add a new document
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId = this.getMaxId() + 1;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);
    this.storeDocuments(this.documents);
  }

  // Update an existing document
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(
      (doc) => doc.id === originalDocument.id
    );
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id; // Preserve the original document ID
    this.documents[pos] = newDocument;
    this.storeDocuments(this.documents);
  }

  // Delete a document
  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.storeDocuments(this.documents);
  }

  // Set documents and emit the change event
  setDocuments(documents: Document[]) {
    this.documents = documents;
    this.documentListChangedEvent.next(this.documents.slice()); // Emit updated documents
  }
}
