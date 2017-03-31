import { TestBed, inject } from '@angular/core/testing';
import { BurialChamberService } from './burial-chamber.service';

describe('BurialChamberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BurialChamberService]
    });
  });

  it('should ...', inject([BurialChamberService], (service: BurialChamberService) => {
    expect(service).toBeTruthy();
  }));
});
