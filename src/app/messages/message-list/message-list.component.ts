import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];
  subscription: Subscription;

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.messageService.getMessages();
    this.subscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.router.navigate(['/messages']);
      }
    );
  }

  onAddMessage(message: Message) {
    // Add the new message to the list
    this.messages.push(message);
    this.messageService.addMessage(message);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
