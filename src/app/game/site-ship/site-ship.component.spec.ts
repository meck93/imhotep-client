import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteShipComponent } from './site-ship.component';

describe('SiteShipComponent', () => {
  let component: SiteShipComponent;
  let fixture: ComponentFixture<SiteShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
