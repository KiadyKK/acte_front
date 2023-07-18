import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTarifaireComponent } from './plan-tarifaire.component';

describe('PlanTarifaireComponent', () => {
  let component: PlanTarifaireComponent;
  let fixture: ComponentFixture<PlanTarifaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanTarifaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanTarifaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
