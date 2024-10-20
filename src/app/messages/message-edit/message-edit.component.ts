import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Message } from '../message.model';
import { Contact } from 'src/app/contacts/contact.model';
import { MessageService } from '../message.service';
import { ContactService } from 'src/app/contacts/contact.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: Contact; // Declare currentSender as a class property

  constructor(private messageService: MessageService, private contactService: ContactService) {}

  ngOnInit() {
    // Assign the contact with id '99' inside ngOnInit
    const senderID = '99';
    this.currentSender = this.contactService.getContact(senderID);
    
    if (this.currentSender) {
      console.log('Current sender:', this.currentSender.name); // Log to verify the contact is retrieved
    } else {
      console.log('Contact not found');
    }
  }

  onSendMessage() {
    // Ensure currentSender is available before creating the message
    if (this.currentSender) {
      // Retrieve input values
      const subjectValue = this.subjectInputRef.nativeElement.value;
      const msgTextValue = this.msgTextInputRef.nativeElement.value;
  
      // Create new Message object (use sender ID instead of name)
      const newMessage = new Message('44', subjectValue, msgTextValue, this.currentSender.id); 
  
      console.log('Message sender ID:', this.currentSender.id); // Log to verify correct sender
  
      // Call addMessage() method from MessageService
      this.messageService.addMessage(newMessage);
  
      // Emit the new message to the parent component
      this.addMessageEvent.emit(newMessage);
  
      // Clear the input fields
      this.onClear();
    } else {
      console.log('No sender found, cannot send the message.');
    }
  }  

  onClear() {
    // Clear input field values
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
