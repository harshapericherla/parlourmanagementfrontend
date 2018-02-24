import { TestBed, inject } from '@angular/core/testing';

import { ServiceReportService } from './service-report.service';

describe('ServiceReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceReportService]
    });
  });

  it('should be created', inject([ServiceReportService], (service: ServiceReportService) => {
    expect(service).toBeTruthy();
  }));
});
