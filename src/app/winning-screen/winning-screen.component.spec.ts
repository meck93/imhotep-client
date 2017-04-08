import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinningScreenComponent } from './winning-screen.component';

describe('WinningScreenComponent', () => {
  let component: WinningScreenComponent;
  let fixture: ComponentFixture<WinningScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinningScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinningScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
