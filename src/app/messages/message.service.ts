import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Message } from './message.model';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService implements OnInit {
  private firebaseUrl =
    'https://cmsproject-fall2024-default-rtdb.firebaseio.com/messages.json';
  private messages: Message[] = [];
  messageChangedEvent = new BehaviorSubject<Message[]>([]);
  private maxId: number = 0;

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  ngOnInit() {}

  storeMessages(messages: Message[]): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const httpOptions = { headers };

    this.http
      .put<Message[]>(this.firebaseUrl, messages, httpOptions)
      .subscribe();
    //this updates the list in the browser immediately
    this.setMessages(messages);
  }

  // Fetch messages from Firebase
  getMessages() {
    this.http
      .get<Message[]>(this.firebaseUrl)
      .pipe(
        tap((messages) => {
          this.setMessages(messages || []);
        })
      )
      .subscribe(
        //Success method
        (updatedMessages: Message[]) => {
          this.messages = updatedMessages.sort((a, b) => +a.id - +b.id);

          this.messageChangedEvent.next(this.messages.slice());
        },
        // Error method
        (error: any) => {
          console.error('Error getting messages:', error);
        }
      );
  }
  // Method to find a specific message by id
  getMessage(id: string): Message | null {
    // Use the find() method to search for the message with the matching id
    const message = this.messages.find((m) => m.id.toString() === id);
    return message ? message : null; // Return the message or null if not found
  }

  getMaxId() {
    let maxId = 0;
    this.messages.forEach((doc) => {
      const currentId =
        typeof doc.id === 'string' ? parseInt(doc.id, 10) : doc.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  addMessage(newMessage: Message) {
    if (!newMessage) return;

    this.maxId = this.getMaxId() + 1;
    newMessage.id = this.maxId.toString();
    this.messages.push(newMessage);
    this.storeMessages(this.messages);
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
    this.messageChangedEvent.next(this.messages.slice());
  }
}
