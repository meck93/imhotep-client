import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurialChamberComponent } from './burial-chamber.component';

describe('BurialChamberComponent', () => {
  let component: BurialChamberComponent;
  let fixture: ComponentFixture<BurialChamberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BurialChamberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BurialChamberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
