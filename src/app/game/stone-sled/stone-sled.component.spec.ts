import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneSledComponent } from './stone-sled.component';

describe('StoneSledComponent', () => {
  let component: StoneSledComponent;
  let fixture: ComponentFixture<StoneSledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoneSledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneSledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
