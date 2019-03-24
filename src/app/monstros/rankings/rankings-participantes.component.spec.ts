import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsParticipantesComponent } from './rankings-participantes.component';

describe('ParticipantesComponent', () => {
  let component: RankingsParticipantesComponent;
  let fixture: ComponentFixture<RankingsParticipantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingsParticipantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingsParticipantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
