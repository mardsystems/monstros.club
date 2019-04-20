import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BotaoDeExecucaoDeSerieComponent } from './botao-de-execucao-de-serie.component';

describe('BotaoDeExecucaoDeSerieComponent', () => {
  let component: BotaoDeExecucaoDeSerieComponent;
  let fixture: ComponentFixture<BotaoDeExecucaoDeSerieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BotaoDeExecucaoDeSerieComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BotaoDeExecucaoDeSerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
