import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { Message } from '../message.model';
import { Contact } from 'src/app/contacts/contact.model';
import { MessageService } from '../message.service';
import { ContactService } from 'src/app/contacts/contact.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css'],
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSenderName: string = 'Michelle Markham'; // Hardcoded sender name for new messages

  constructor(
    private messageService: MessageService,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    // No need to fetch sender with ID '99' since it's hardcoded for new messages
    console.log('Current sender for new messages:', this.currentSenderName);
  }

  onSendMessage() {
    // Retrieve input values
    const subjectValue = this.subjectInputRef.nativeElement.value;
    const msgTextValue = this.msgTextInputRef.nativeElement.value;

    // Create new Message object with hardcoded sender name
    const newMessage = new Message(
      'Michelle Markham', // Use a unique ID for the new message
      subjectValue,
      msgTextValue,
      this.currentSenderName // Use the hardcoded sender name
    );

    console.log('New message:', newMessage);

    // Call addMessage() method from MessageService
    this.messageService.addMessage(newMessage);

    // Emit the new message to the parent component
    this.addMessageEvent.emit(newMessage);

    // Clear the input fields
    this.onClear();
  }

  onClear() {
    // Clear input field values
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
