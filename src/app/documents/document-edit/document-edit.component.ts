import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css'],
})
export class DocumentEditComponent implements OnInit, OnDestroy {
  @ViewChild('documentForm') documentForm: NgForm;

  originalDocument: Document;
  document: Document = { id: '', name: '', url: '', children: [] };
  isNewDocument: boolean = false;
  editMode: boolean = false;

  private routeSubscription: Subscription; // To handle route subscriptions
  private queryParamsSubscription: Subscription; // To handle query params subscriptions
  private documentSubscription: Subscription; // To handle document fetch subscription

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    // Subscribe to query parameters to determine the mode (add or edit)
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.isNewDocument = params['isNew'] === 'true';

        if (!this.isNewDocument) {
          // Subscribe to route parameters to get the document ID
          this.routeSubscription = this.route.params.subscribe((params) => {
            const id = params['id'];

            // Fetch document as an Observable and handle it
            this.documentSubscription = this.documentService
              .getDocument(id)
              .subscribe(
                (existingDocument: Document) => {
                  if (existingDocument) {
                    this.originalDocument = existingDocument;
                    // Clone the document to prevent mutation
                    this.document = {
                      ...existingDocument,
                      children: existingDocument.children
                        ? existingDocument.children.map((child) => ({
                            ...child,
                          }))
                        : [],
                    };
                  } else {
                    console.error(`Document with ID ${id} not found.`);
                  }
                },
                (error) => {
                  console.error(
                    `Error fetching document with ID ${id}:`,
                    error
                  );
                }
              );
          });
        }
      }
    );
  }

  onSave(form: NgForm) {
    const updatedDocument: Document = {
      ...this.document,
      ...form.value,
    };

    if (this.isNewDocument) {
      this.documentService.addDocument(updatedDocument)?.subscribe({
        next: (response) => {
          console.log('Document added successfully:', response);
          this.documentService.getDocuments(); // Refresh the list
          this.onCancel(); // Navigate away after successful save
        },
        error: (error) => {
          console.error('Error adding document:', error);
        },
        complete: () => {
          console.log('Add document operation completed.');
        },
      });
    } else {
      this.documentService
        .updateDocument(this.originalDocument, updatedDocument)
        ?.subscribe({
          next: (response) => {
            console.log('Document updated successfully:', response);
            this.documentService.getDocuments(); // Refresh the list
            this.onCancel(); // Navigate away after successful update
          },
          error: (error) => {
            console.error('Error updating document:', error);
          },
          complete: () => {
            console.log('Update document operation completed.');
          },
        });
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.documentSubscription) {
      this.documentSubscription.unsubscribe();
    }
  }
}
