import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketPlaceComponent } from './market-place.component';

describe('MarketPlaceComponent', () => {
  let component: MarketPlaceComponent;
  let fixture: ComponentFixture<MarketPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
