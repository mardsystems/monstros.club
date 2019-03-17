import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsItemComponent } from './rankings-item.component';

describe('RankingComponent', () => {
  let component: RankingsItemComponent;
  let fixture: ComponentFixture<RankingsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
