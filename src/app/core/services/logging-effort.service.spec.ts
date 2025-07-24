import { TestBed } from '@angular/core/testing';

import { LoggingEffortService } from './logging-effort.service';

describe('LoggingEffortService', () => {
  let service: LoggingEffortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggingEffortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
