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
export class DocumentDetailComponent implements OnInit {
  document: Document;
  nativeWindow: any;
  id: string; // The id should be a string to match the unique document id
  private routeSub: Subscription;

  constructor(
    private documentService: DocumentService,
    private windowRefService: WindRefService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.nativeWindow = windowRefService.getNativeWindow();
  }

  ngOnInit() {
    // Subscribe to route params to fetch the document based on the unique id
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.id = params['id']; // Retrieve the unique id as a string from route params

      // Fetch the document by its unique id (no need for incrementing)
      this.document = this.documentService.getDocument(this.id);

      // Log for debugging purposes
      console.log('Document ID:', this.id, 'Fetched Document:', this.document);
    });
  }

  onDelete() {
    console.log('Document ID:', this.id, 'Fetched Document:', this.document);
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }

  onEditDocument() {
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      queryParams: { isNew: false },
    });
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }
}
