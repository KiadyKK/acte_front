import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReengagementComponent } from './reengagement.component';

describe('ReengagementComponent', () => {
  let component: ReengagementComponent;
  let fixture: ComponentFixture<ReengagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReengagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReengagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
