import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDepositDialogComponent } from './create-deposit-dialog.component';

describe('CreateDepositDialogComponent', () => {
  let component: CreateDepositDialogComponent;
  let fixture: ComponentFixture<CreateDepositDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDepositDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDepositDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
