import { TestBed, inject } from '@angular/core/testing';
import { SupplySledService } from './supply-sled.service';

describe('SupplySledService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplySledService]
    });
  });

  it('should ...', inject([SupplySledService], (service: SupplySledService) => {
    expect(service).toBeTruthy();
  }));
});
