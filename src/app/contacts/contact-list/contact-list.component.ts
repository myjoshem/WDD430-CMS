import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[];
  contactsSubscription: Subscription;
  term: string;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    //initialize and retrieve list of contacts
    this.contactService.getContacts();
    // Set `term` to an empty string to ensure the filter displays all contacts
    this.term = '';

    // Optionally, focus the search box when the page loads
    setTimeout(() => {
      const searchBox = document.querySelector<HTMLInputElement>('#searchBox');
      if (searchBox) {
        searchBox.focus();
      }
    });

    // Subscribe to contact changes
    this.contactsSubscription =
      this.contactService.contactListChangedEvent.subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts; // Update contacts list when it changes
          this.router.navigate(['/contacts']);
        }
      );
  }

  ngOnDestroy(): void {
    this.contactsSubscription.unsubscribe();
  }

  onAddContact() {
    this.router.navigate(['/contacts/new'], { queryParams: { isNew: true } });
  }

  search(value: string) {
    this.term = value;
  }
}
