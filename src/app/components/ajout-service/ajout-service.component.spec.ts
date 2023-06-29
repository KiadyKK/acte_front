import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutServiceComponent } from './ajout-service.component';

describe('AjoutServiceComponent', () => {
  let component: AjoutServiceComponent;
  let fixture: ComponentFixture<AjoutServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
