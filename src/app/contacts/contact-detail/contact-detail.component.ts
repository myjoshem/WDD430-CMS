import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css'],
})
export class ContactDetailComponent implements OnInit {
  contact: Contact;
  id: string; // The id should be a string to match the unique document id
  private routeSub: Subscription;
  hasGroup: boolean = false; // Property to track if the contact has a group

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to route params to fetch the document based on the unique id
    this.routeSub = this.route.params.subscribe((params: Params) => {
      this.id = params['id']; // Retrieve the unique id as a string from route params

      // Fetch the contact by its unique id
      this.contact = this.contactService.getContact(this.id);

      // Check if the contact has a group with items
      this.hasGroup =
        Array.isArray(this.contact?.group) && this.contact.group.length > 0;
    });
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }

  onEditContact() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
