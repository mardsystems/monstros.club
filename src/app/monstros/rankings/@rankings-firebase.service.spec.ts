import { TestBed } from '@angular/core/testing';
import { RankingsFirebaseService } from './@rankings-firebase.service';

describe('RankingsFirebaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RankingsFirebaseService = TestBed.get(RankingsFirebaseService);
    expect(service).toBeTruthy();
  });
});
