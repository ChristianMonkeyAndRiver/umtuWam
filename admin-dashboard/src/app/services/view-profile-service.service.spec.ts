import { TestBed } from '@angular/core/testing';

import { ViewProfileServiceService } from './view-profile-service.service';

describe('ViewProfileServiceService', () => {
  let service: ViewProfileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewProfileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
