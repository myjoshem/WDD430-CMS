import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  // Holds the contact details being added or edited
  contact: Contact;
  // Boolean to determin if this is a new contact or an existing contact
  isNewContact: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isNewContact = params['isNew'] === 'true';

      if (this.isNewContact) {
        this.contact = {
          id: '',
          name: '',
          email: '',
          phone: '',
          imageUrl: '',
          group: [],
        };
      } else {
        const id = this.route.snapshot.params['id'];
        const existingContact = this.contactService.getContact(id);
        this.contact = {
          ...existingContact,
          group: existingContact.group
            ? existingContact.group.map((contact) => ({ ...contact }))
            : [],
        };
      }
    });
  }

  onSave() {
    if (this.isNewContact) {
      // If it's a new document, call addDocument() on the DocumentService
      // The documentService will generate a unique ID, add it to the list, and emit the updated list
      this.contactService.addContact(this.contact);
    } else {
      // If editing, first retrieve the original document by ID to keep its original ID
      const originalContact = this.contactService.getContact(this.contact.id);
      // Call updateDocument() to replace the original document's properties with the new values from the input
      this.contactService.updateContact(originalContact, this.contact);
    }
    // Navigate back to the documents list page after saving
    this.router.navigate(['/contacts']);
  }
}
