import { TestBed, inject } from '@angular/core/testing';
import { MarketPlaceService } from './market-place.service';

describe('MarketPlaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketPlaceService]
    });
  });

  it('should ...', inject([MarketPlaceService], (service: MarketPlaceService) => {
    expect(service).toBeTruthy();
  }));
});
