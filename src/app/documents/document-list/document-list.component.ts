import { Component, OnInit, OnDestroy } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents: Document[];
  docsSubscription: Subscription;

  constructor(
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.documentService.getDocuments(); // Triggers the HTTP request and updates the service's internal state
    this.docsSubscription =
      this.documentService.documentListChangedEvent.subscribe(
        (documents: Document[]) => {
          this.documents = documents; // Update local documents list when the event is emitted
          this.router.navigate(['/documents']);
        }
      );
  }

  ngOnDestroy() {
    this.docsSubscription.unsubscribe();
  }

  onAddDocument() {
    this.router.navigate(['/documents/new'], { queryParams: { isNew: true } });
  }
}
