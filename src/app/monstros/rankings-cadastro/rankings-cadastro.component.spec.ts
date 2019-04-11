import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingsCadastroComponent } from './rankings-cadastro.component';

describe('RankingsRankingsCadastroComponent', () => {
  let component: RankingsCadastroComponent;
  let fixture: ComponentFixture<RankingsCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RankingsCadastroComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingsCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
