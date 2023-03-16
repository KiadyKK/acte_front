import { TestBed } from '@angular/core/testing';

import { ActeMasseService } from './acte-masse.service';

describe('ActeMasseService', () => {
  let service: ActeMasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActeMasseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
