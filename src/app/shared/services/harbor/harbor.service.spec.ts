import { TestBed, inject } from '@angular/core/testing';
import { HarborService } from './harbor.service';

describe('HarborService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HarborService]
    });
  });

  it('should ...', inject([HarborService], (service: HarborService) => {
    expect(service).toBeTruthy();
  }));
});
