import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationMetierComponent } from './validation-metier.component';

describe('ValidationMetierComponent', () => {
  let component: ValidationMetierComponent;
  let fixture: ComponentFixture<ValidationMetierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationMetierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationMetierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
