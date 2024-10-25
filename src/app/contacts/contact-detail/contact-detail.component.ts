import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
 contact: Contact;
 id: string; // The id should be a string to match the unique document id
 private routeSub: Subscription;

 constructor(
  private contactService: ContactService,
  private route: ActivatedRoute,
  private router: Router) {}

 ngOnInit() {
  // Subscribe to route params to fetch the document based on the unique id
  this.routeSub = this.route.params.subscribe((params: Params) => {
    this.id = params['id']; // Retrieve the unique id as a string from route params
    
    // Fetch the contact by its unique id (no need for incrementing)
    this.contact = this.contactService.getContact(this.id);
  });
}

onDelete() {
  this.contactService.deleteContact(this.contact);
  this.router.navigate(['/contacts']);
}

onEditDocument() {
  this.router.navigate(['edit'], {relativeTo: this.route});
  // alt this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});

}
}

