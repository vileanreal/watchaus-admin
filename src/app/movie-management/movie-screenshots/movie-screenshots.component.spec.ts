import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieScreenshotsComponent } from './movie-screenshots.component';

describe('MovieScreenshotsComponent', () => {
  let component: MovieScreenshotsComponent;
  let fixture: ComponentFixture<MovieScreenshotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieScreenshotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieScreenshotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
