import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit, OnDestroy {
  @ViewChild('contactForm') contactForm: NgForm;
  // Holds the contact details being added or edited
  originalContact: Contact;
  contact: Contact = {
    id: '',
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    group: null,
  };
  groupContacts: Contact[];
  // Boolean to determine if this is a new contact or an existing contact
  isNewContact: boolean = false;
  editMode: boolean = false;

  private routeSubscription: Subscription; // To handle route subscriptions
  private queryParamsSubscription: Subscription; // To handle query params subscriptions

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.isNewContact = params['isNew'] === 'true';

        if (!this.isNewContact) {
          // Subscribe to route parameters to get the contact ID
          this.routeSubscription = this.route.params.subscribe((params) => {
            const id = params['id'];
            const existingContact = this.contactService.getContact(id);

            if (existingContact) {
              // Clone the contact to prevent mutation
              this.contact = {
                ...existingContact,
                group: existingContact.group ? [...existingContact.group] : [],
              };

              // If the contact has a group, clone and assign it to the groupContacts property
              this.groupContacts = existingContact.group
                ? existingContact.group.map((groupContact) => ({
                    ...groupContact,
                  }))
                : [];
            } else {
              console.error(`Contact with ID ${id} not found.`);
            }
          });
        }
      }
    );
  }

  onSave(form: NgForm) {
    const updatedContact = {
      ...this.contact,
      ...form.value,
    };

    if (this.isNewContact) {
      this.contactService.addContact(updatedContact);
    } else {
      const originalContact = this.contactService.getContact(this.contact.id);
      this.contactService.updateContact(originalContact, updatedContact);
    }
    this.onCancel();
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    return this.groupContacts.some(
      (groupContact) => groupContact.id === newContact.id
    );
  }

  addToGroup(event: CdkDragDrop<Contact[]>): void {
    const selectedContact: Contact = event.item.data;
    if (this.isInvalidContact(selectedContact)) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number): void {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
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
