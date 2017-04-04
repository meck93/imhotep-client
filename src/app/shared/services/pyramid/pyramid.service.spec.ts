import { TestBed, inject } from '@angular/core/testing';
import { PyramidService } from './pyramid.service';

describe('PyramidService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PyramidService]
    });
  });

  it('should ...', inject([PyramidService], (service: PyramidService) => {
    expect(service).toBeTruthy();
  }));
});
