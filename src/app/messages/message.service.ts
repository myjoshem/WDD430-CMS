import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnInit {
 private messages: Message [] = [];
  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {
    this.messages = MOCKMESSAGES;
}

  ngOnInit() {
      
  }

  // Method to return a copy of the messages array
getMessages(): Message[] {
  // Use the slice() method to return a copy of the messages array
  return this.messages.slice();
}

// Method to find a specific message by id
getMessage(id: string): Message | null {
  // Use the find() method to search for the message with the matching id
  const message = this.messages.find(m => m.id === id);
  return message ? message : null; // Return the message or null if not found
}

  addMessage(messages: Message) {
    this.messages.push(messages)
    this.messageChangedEvent.emit(this.messages.slice());
  }
}
