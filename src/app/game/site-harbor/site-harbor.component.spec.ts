import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SiteHarborComponent} from './site-harbor.component';

describe('SiteHarborComponent', () => {
    let component: SiteHarborComponent;
    let fixture: ComponentFixture<SiteHarborComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SiteHarborComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SiteHarborComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
