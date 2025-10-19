import { TestBed } from '@angular/core/testing';

import { NewInovoice } from './new-inovoice';

describe('NewInovoice', () => {
  let service: NewInovoice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewInovoice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
