import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
})
export class DocumentEditComponent implements OnInit {
  // Holds the document being added or edited
  document: Document;
  // Boolean to determine if this is a new document or an existing one being edited
  isNewDocument: boolean;

  constructor(
    private route: ActivatedRoute, // Service to access route parameters and query params
    private router: Router, // Service to programmatically navigate routes
    private documentService: DocumentService // Service to handle document data operations
  ) {}

  ngOnInit() {
    // Subscribe to query parameters to determine if we're adding a new document or editing an existing one
    this.route.queryParams.subscribe((params) => {
      // Check if 'isNew' parameter is set to 'true'
      this.isNewDocument = params['isNew'] === 'true';

      if (this.isNewDocument) {
        // If adding a new document, initialize 'document' with empty fields
        this.document = { id: '', name: '', url: '', children: [] };
      } else {
        // If editing an existing document, retrieve the 'id' from route parameters
        const id = this.route.snapshot.params['id'];
        // Fetch the existing document from the DocumentService by ID
        const existingDocument = this.documentService.getDocument(id);
        // Clone the document to avoid modifying the original directly in the service
        this.document = {
          ...existingDocument,
          //in order to clone nested array of objects, such as the children property, it must be handled in this manner because the ...existingDocument (spread factor, only does a shallow copy of the first layer of objects in Document object)
          children: existingDocument.children
            ? existingDocument.children.map((child) => ({ ...child }))
            : [],
        };
      }
    });
  }

  // Method called when the "Save" button is clicked
  onSave() {
    if (this.isNewDocument) {
      // If it's a new document, call addDocument() on the DocumentService
      // The documentService will generate a unique ID, add it to the list, and emit the updated list
      this.documentService.addDocument(this.document);
    } else {
      // If editing, first retrieve the original document by ID to keep its original ID
      const originalDocument = this.documentService.getDocument(
        this.document.id
      );
      // Call updateDocument() to replace the original document's properties with the new values from the input
      this.documentService.updateDocument(originalDocument, this.document);
    }
    // Navigate back to the documents list page after saving
    this.router.navigate(['/documents']);
  }
}
