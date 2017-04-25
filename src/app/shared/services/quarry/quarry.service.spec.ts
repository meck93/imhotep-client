import { TestBed, inject } from '@angular/core/testing';
import { QuarryService } from './quarry.service';

describe('QuarryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuarryService]
    });
  });

  it('should ...', inject([QuarryService], (service: QuarryService) => {
    expect(service).toBeTruthy();
  }));
});
