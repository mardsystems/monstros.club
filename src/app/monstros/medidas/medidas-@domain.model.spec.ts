import { TestBed } from '@angular/core/testing';
import { MedidasFirebaseService } from './medidas-@firebase.service';

describe('MedidasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedidasFirebaseService = TestBed.get(MedidasFirebaseService);
    expect(service).toBeTruthy();
  });
});
