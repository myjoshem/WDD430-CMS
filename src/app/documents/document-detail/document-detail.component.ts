import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { WindRefService } from 'src/app/wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css'],
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  document: Document;
  nativeWindow: any;
  id: string; // The id should be a string to match the unique document id
  private routeSub: Subscription; // For subscribing to route changes
  private documentSub: Subscription; // For subscribing to document fetches

  constructor(
    private documentService: DocumentService,
    private windowRefService: WindRefService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.nativeWindow = this.windowRefService.getNativeWindow();
  }

  ngOnInit() {
    // Subscribe to route params to fetch the document based on the unique id
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.id = params['id']; // Retrieve the unique id as a string from route params

      // Fetch the document by its unique id
      this.documentSub = this.documentService.getDocument(this.id).subscribe(
        (fetchedDocument: Document) => {
          this.document = fetchedDocument; // Assign the fetched document
          console.log('Document fetched successfully:', this.document); // Debug log
        },
        (error) => {
          console.error('Error fetching document:', error); // Handle errors
        }
      );
    });
  }

  onDelete() {
    if (this.document) {
      this.documentService.deleteDocument(this.document);
      this.router.navigate(['/documents']);
    }
  }

  onEditDocument() {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      queryParams: { isNew: false },
    });
  }

  onView() {
    if (this.document?.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions to prevent memory leaks
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.documentSub) {
      this.documentSub.unsubscribe();
    }
  }
}
