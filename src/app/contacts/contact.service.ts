import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  private maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  // Method to return a copy of the contacts array
  getContacts(): Contact[] {
    return [...this.contacts]; // Use spread syntax for a shallow copy
  }

  // Method to find a specific contact by id
  getContact(id: string): Contact | null {
    return (
      this.contacts.find((contact) => contact.id.toString() === id) || null
    );
  }

  getMaxId() {
    let maxId = 0;
    this.contacts.forEach((doc) => {
      const currentId = parseInt(doc.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addContact(newContact: Contact) {
    //check to see if there is information passed in newContact
    if (!newContact) {
      return;
    }
    // make sure to check on maxID, then icrement to get id for new contact
    this.maxContactId = this.getMaxId();
    this.maxContactId++;
    //the id in contact model is string, so we need to save the new id as a string
    newContact.id = this.maxContactId.toString();
    //push the new contact object, incuding the new id to a session copy of the contact list
    //this will not persist or copy to MOCKCONTACTS
    this.contacts.push(newContact);
    const contactsListClone = this.contacts.slice();
    //then pass new list to changed even for routing
    this.contactListChangedEvent.next(contactsListClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    const contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  deleteContact(contact: Contact): void {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next([...this.contacts]); // Use Subject to broadcast the updated list
  }
}
