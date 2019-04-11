import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AparelhosCadastroComponent } from './aparelhos-cadastro.component';

describe('AparelhosCadastroComponent', () => {
  let component: AparelhosCadastroComponent;
  let fixture: ComponentFixture<AparelhosCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AparelhosCadastroComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AparelhosCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
