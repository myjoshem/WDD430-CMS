import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
   }

    // Method to return a copy of the contacts array
    getContacts(): Contact[] {
      // Use the slice() method to return a copy of the contacts array
      return this.contacts.slice();
    }
  
    // Method to find a specific contact by id
    getContact(id: string): Contact | null {
      // Use the find() method to search for the contact with the matching id
      const contact = this.contacts.find(c => c.id === id);
      return contact ? contact : null; // Return the contact or null if not found
    }
   }

