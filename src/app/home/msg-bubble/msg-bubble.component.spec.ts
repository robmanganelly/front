import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgBubbleComponent } from './msg-bubble.component';

describe('MsgBubbleComponent', () => {
  let component: MsgBubbleComponent;
  let fixture: ComponentFixture<MsgBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
