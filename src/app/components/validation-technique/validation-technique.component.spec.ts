import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationTechniqueComponent } from './validation-technique.component';

describe('ValidationTechniqueComponent', () => {
  let component: ValidationTechniqueComponent;
  let fixture: ComponentFixture<ValidationTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationTechniqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
