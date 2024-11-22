import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter',
})
export class ContactsFilterPipe implements PipeTransform {
  transform(contacts: Contact[], term: string): Contact[] {
    // Create a new array to contain the filtered list of contacts
    let filteredContacts: Contact[] = [];

    // Iterate over every contact in the contacts list
    for (const contact of contacts) {
      // Check if the contact's name includes the value of the search term
      if (contact.name.toLowerCase().includes(term.toLowerCase())) {
        // Add the contact to the filtered array
        filteredContacts.push(contact);
      }
    }
    // If the filtered array has no contacts, return the original contacts list
    if (filteredContacts.length === 0) {
      return contacts;
    }

    // Return the new filtered array of contacts
    return filteredContacts;
  }
}
