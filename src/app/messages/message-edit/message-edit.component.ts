import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})

export class MessageEditComponent {
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = 'Michelle'; //hard coded name to fulfill required model inputs

  onSendMessage() {
    // Retrieve input values
    const subjectValue = this.subjectInputRef.nativeElement.value;
    const msgTextValue = this.msgTextInputRef.nativeElement.value;

    // Create new Message object
    const newMessage = new Message('1', this.currentSender, subjectValue, msgTextValue);

    // Emit the new Message object
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