import { TestBed, inject } from '@angular/core/testing';
import { NotificationBoardService } from './notification-board.service';

describe('NotificationBoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationBoardService]
    });
  });

  it('should ...', inject([NotificationBoardService], (service: NotificationBoardService) => {
    expect(service).toBeTruthy();
  }));
});
