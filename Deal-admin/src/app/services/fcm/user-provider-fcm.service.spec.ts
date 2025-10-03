import { TestBed } from '@angular/core/testing';

import { UserProviderFcmService } from './user-provider-fcm.service';

describe('UserProviderFcmService', () => {
  let service: UserProviderFcmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserProviderFcmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
