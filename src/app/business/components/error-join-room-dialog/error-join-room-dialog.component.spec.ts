import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorJoinRoomDialogComponent } from './error-join-room-dialog.component';

describe('ErrorJoinRoomDialogComponent', () => {
  let component: ErrorJoinRoomDialogComponent;
  let fixture: ComponentFixture<ErrorJoinRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorJoinRoomDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorJoinRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
