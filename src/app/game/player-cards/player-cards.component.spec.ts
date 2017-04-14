import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCardsComponent } from './player-cards.component';

describe('PlayerCardsComponent', () => {
  let component: PlayerCardsComponent;
  let fixture: ComponentFixture<PlayerCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
