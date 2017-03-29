import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplySledComponent } from './supply-sled.component';

describe('SupplySledComponent', () => {
  let component: SupplySledComponent;
  let fixture: ComponentFixture<SupplySledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplySledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplySledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
