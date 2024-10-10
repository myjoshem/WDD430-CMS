import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit{
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  
  documents: Document[] = [
    new Document(
      "1",
      "Document 1",
      "This is the first document.",
      "http://example.com/document1",
      "../../assets/images/document1.jpg",
      null
    ),
    new Document(
      "2",
      "Document 2",
      "This is the second document.",
      "http://example.com/document2",
      "../../assets/images/document2.jpg",
      null
    ),
    new Document(
      "3",
      "Document 3",
      "This is the third document.",
      "http://example.com/document3",
      "../../assets/images/document3.jpg",
      null
    ),
    new Document(
      "4",
      "Document 4",
      "This is the fourth document.",
      "http://example.com/document4",
      "../../assets/images/document4.jpg",
      null
    ),
    new Document(
      "5",
      "Document 5",
      "This is the fifth document.",
      "http://example.com/document5",
      "../../assets/images/document5.jpg",
      null
    )
  ];
  
  constructor() {}

  ngOnInit() {}

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
