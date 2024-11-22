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
            const existingDocument = this.documentService.getDocument(id);

            if (existingDocument) {
              // Clone the document to prevent mutation
              this.document = {
                ...existingDocument,
                children: existingDocument.children
                  ? existingDocument.children.map((child) => ({ ...child }))
                  : [],
              };
            } else {
              console.error(`Document with ID ${id} not found.`);
            }
          });
        }
      }
    );
  }

  onSave(form: NgForm) {
    const updatedDocument = {
      ...this.document,
      ...form.value,
    };

    if (this.isNewDocument) {
      this.documentService.addDocument(updatedDocument);
    } else {
      const originalDocument = this.documentService.getDocument(
        this.document.id
      );
      this.documentService.updateDocument(originalDocument, updatedDocument);
    }
    this.documentForm.reset();
    this.onCancel();
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
  }
}
