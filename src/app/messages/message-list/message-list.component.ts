import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Alice', 'Hello World', 'This is my first message!'),
    new Message('2', 'Bob', 'Greetings', 'How is everyone doing today?'),
    new Message('3', 'Charlie', 'Updates', 'New updates will be available soon.')
  ];

  constructor() {}

  ngOnInit(): void {}

  onAddMessage(message: Message) {
    // Add the new message to the list
    this.messages.push(message);
  }
}
