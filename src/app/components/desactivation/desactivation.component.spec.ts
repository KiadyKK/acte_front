import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesactivationComponent } from './desactivation.component';

describe('DesactivationComponent', () => {
  let component: DesactivationComponent;
  let fixture: ComponentFixture<DesactivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesactivationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
