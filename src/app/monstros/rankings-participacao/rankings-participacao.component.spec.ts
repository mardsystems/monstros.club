import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingsParticipacaoComponent } from './rankings-participacao.component';

describe('RankingsParticipacaoComponent', () => {
  let component: RankingsParticipacaoComponent;
  let fixture: ComponentFixture<RankingsParticipacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RankingsParticipacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingsParticipacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
