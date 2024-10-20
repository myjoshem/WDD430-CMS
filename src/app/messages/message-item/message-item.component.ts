import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from 'src/app/contacts/contact.model';
import { MessageService } from '../message.service';
import { ContactService } from 'src/app/contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(
    private messageService: MessageService,
    private contactService: ContactService) {};
  
    ngOnInit() {
      // Fetch contact based on the sender ID passed in the message
      const contact: Contact = this.contactService.getContact(this.message.sender);
      if (contact) {
        this.messageSender = contact.name;
      } else {
        this.messageSender = 'Unknown sender';
      }
    }
    

}
