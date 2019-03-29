import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesItemComponent } from './series-item.component';

describe('SerieComponent', () => {
  let component: SeriesItemComponent;
  let fixture: ComponentFixture<SeriesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
