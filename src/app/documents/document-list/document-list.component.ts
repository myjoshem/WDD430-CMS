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

  constructor(private documentService: DocumentService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
    // Subscribe to document changesEvent
    this.docsSubscription =
      this.documentService.documentListChangedEvent.subscribe(
        (documents: Document[]) => {
          this.documents = documents; // Update documents list when it changes
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
