import { TestBed, inject } from '@angular/core/testing';
import { ResponseHandlerService } from './response-handler.service';

describe('ResponseHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponseHandlerService]
    });
  });

  it('should ...', inject([ResponseHandlerService], (service: ResponseHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
