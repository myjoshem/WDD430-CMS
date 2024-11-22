import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService implements OnInit {
  private firebaseUrl =
    'https://cmsproject-fall2024-default-rtdb.firebaseio.com/contacts.json';
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new BehaviorSubject<Contact[]>([]);
  contacts: Contact[] = [];
  private maxContactId: number = 0;
  private isFetching = false; // Prevent redundant fetching

  constructor(private http: HttpClient) {
    this.getContacts();
    this.maxContactId = this.getMaxId();
  }

  ngOnInit() {}

  storeContacts(contacts: Contact[]): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const httpOptions = { headers };

    this.http
      .put<Contact[]>(this.firebaseUrl, contacts, httpOptions)
      .subscribe();
    //this updates the list in the browser immediately
    this.setContacts(contacts);
  }

  getContacts() {
    if (this.isFetching) return;

    this.isFetching = true;
    this.http
      .get<Contact[]>(this.firebaseUrl)
      .pipe(
        tap((contacts) => {
          this.setContacts(contacts || []);
        })
      )
      .subscribe(
        () => {
          this.isFetching = false;
        },
        (error: any) => {
          console.error('Error getting contacts:', error);
          this.isFetching = false;
        }
      );
  }

  getContact(id: string): Contact | null {
    return (
      this.contacts.find((contact) => contact.id.toString() === id) || null
    );
  }

  getMaxId() {
    let maxId = 0;
    this.contacts.forEach((doc) => {
      const currentId =
        typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    this.maxContactId = this.getMaxId() + 1;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts(this.contacts);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts(this.contacts);
  }

  deleteContact(contact: Contact): void {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    this.storeContacts(this.contacts);
  }
  //we call this to set the local contacts after any change and then call it so the list in the browser is updated
  setContacts(contacts: Contact[]) {
    this.contacts = contacts;
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}
