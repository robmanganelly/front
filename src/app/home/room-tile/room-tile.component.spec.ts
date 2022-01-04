import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTileComponent } from './room-tile.component';

describe('RoomTileComponent', () => {
  let component: RoomTileComponent;
  let fixture: ComponentFixture<RoomTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
