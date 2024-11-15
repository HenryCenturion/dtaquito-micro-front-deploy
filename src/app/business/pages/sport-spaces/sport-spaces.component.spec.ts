import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportSpacesComponent } from './sport-spaces.component';

describe('SportSpacesComponent', () => {
  let component: SportSpacesComponent;
  let fixture: ComponentFixture<SportSpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportSpacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
