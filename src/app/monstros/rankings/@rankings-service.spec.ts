import { TestBed } from '@angular/core/testing';
import { RankingsService } from './rankings-@firebase.service';

describe('RankingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RankingsService = TestBed.get(RankingsService);
    expect(service).toBeTruthy();
  });
});
