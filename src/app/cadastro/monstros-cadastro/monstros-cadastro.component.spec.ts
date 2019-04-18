import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MonstrosCadastroComponent } from './monstros-cadastro.component';

describe('MonstrosCadastroComponent', () => {
  let component: MonstrosCadastroComponent;
  let fixture: ComponentFixture<MonstrosCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonstrosCadastroComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonstrosCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
