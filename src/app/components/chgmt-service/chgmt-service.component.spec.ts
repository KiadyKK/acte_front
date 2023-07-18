import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChgmtServiceComponent } from './chgmt-service.component';

describe('ChgmtServiceComponent', () => {
  let component: ChgmtServiceComponent;
  let fixture: ComponentFixture<ChgmtServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChgmtServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChgmtServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
