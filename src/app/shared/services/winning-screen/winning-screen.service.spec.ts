import { TestBed, inject } from '@angular/core/testing';
import { WinningScreenService } from './winning-screen.service';

describe('ScoreBoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WinningScreenService]
    });
  });

  it('should ...', inject([WinningScreenService], (service: WinningScreenService) => {
    expect(service).toBeTruthy();
  }));
});