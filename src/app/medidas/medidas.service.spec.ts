import { TestBed } from '@angular/core/testing';

import { MedidasService } from './medidas.service';

describe('MedidasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedidasService = TestBed.get(MedidasService);
    expect(service).toBeTruthy();
  });
});
