import { TestBed } from '@angular/core/testing';

import { MonstrosService } from './@monstros.service';

describe('MonstrosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonstrosService = TestBed.get(MonstrosService);
    expect(service).toBeTruthy();
  });
});
