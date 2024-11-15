import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmJoinRoomDialogComponent } from './confirm-join-room-dialog.component';

describe('ConfirmJoinRoomDialogComponent', () => {
  let component: ConfirmJoinRoomDialogComponent;
  let fixture: ComponentFixture<ConfirmJoinRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmJoinRoomDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmJoinRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
