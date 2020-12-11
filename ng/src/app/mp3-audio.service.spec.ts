import { TestBed } from '@angular/core/testing';

import { Mp3AudioService } from './mp3-audio.service';

describe('Mp3AudioService', () => {
  let service: Mp3AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mp3AudioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
