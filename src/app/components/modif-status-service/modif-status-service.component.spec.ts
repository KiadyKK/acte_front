import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifStatusServiceComponent } from './modif-status-service.component';

describe('ModifStatusServiceComponent', () => {
  let component: ModifStatusServiceComponent;
  let fixture: ComponentFixture<ModifStatusServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifStatusServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifStatusServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
