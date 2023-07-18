import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitConsoComponent } from './limit-conso.component';

describe('LimitConsoComponent', () => {
  let component: LimitConsoComponent;
  let fixture: ComponentFixture<LimitConsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitConsoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitConsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
