import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedMovieModalComponent } from './assigned-movie-modal.component';

describe('AssignedMovieModalComponent', () => {
  let component: AssignedMovieModalComponent;
  let fixture: ComponentFixture<AssignedMovieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedMovieModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedMovieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
