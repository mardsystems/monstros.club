import { TestBed } from '@angular/core/testing';

import { MonstrosFirecloudRepository } from './monstros.domain-model-firecloud';

describe('MonstrosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonstrosFirecloudRepository = TestBed.get(MonstrosFirecloudRepository);
    expect(service).toBeTruthy();
  });
});
