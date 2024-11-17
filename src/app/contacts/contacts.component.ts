import { Component, OnInit } from '@angular/core';
import { ContactService } from './contact.service';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  constructor(private contactService: ContactService) {}

  ngOnInit() {}
}
