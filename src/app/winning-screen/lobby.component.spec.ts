/**
 * Created by nikza on 20.03.2017.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinningScreenComponent } from './winning-screen.component';

describe('LobbyComponent', () => {
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
