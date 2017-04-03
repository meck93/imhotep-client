import { TestBed, inject } from '@angular/core/testing';
import { ObeliskService } from './obelisk.service';

describe('ObeliskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObeliskService]
    });
  });

  it('should ...', inject([ObeliskService], (service: ObeliskService) => {
    expect(service).toBeTruthy();
  }));
});