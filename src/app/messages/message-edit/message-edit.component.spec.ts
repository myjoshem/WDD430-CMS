import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageEditComponent } from './message-edit.component';

describe('MessageEditComponent', () => {
  let component: MessageEditComponent;
  let fixture: ComponentFixture<MessageEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageEditComponent]
    });
    fixture = TestBed.createComponent(MessageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
