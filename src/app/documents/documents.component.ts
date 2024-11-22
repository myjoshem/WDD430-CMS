import { Component, OnInit } from '@angular/core';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    return this.documentService.getDocuments();
  }
}
