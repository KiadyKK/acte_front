import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyFieldsComponent } from './modify-fields.component';

describe('ModifyFieldsComponent', () => {
  let component: ModifyFieldsComponent;
  let fixture: ComponentFixture<ModifyFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyFieldsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
