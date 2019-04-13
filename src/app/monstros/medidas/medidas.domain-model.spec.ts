import { TestBed } from '@angular/core/testing';
import { MedidasFirecloudRepository } from './medidas.domain-model-firecloud';

describe('MedidasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedidasFirecloudRepository = TestBed.get(MedidasFirecloudRepository);
    expect(service).toBeTruthy();
  });
});
