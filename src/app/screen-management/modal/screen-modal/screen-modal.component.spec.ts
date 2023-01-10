import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenModalComponent } from './screen-modal.component';

describe('ScreenModalComponent', () => {
  let component: ScreenModalComponent;
  let fixture: ComponentFixture<ScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
