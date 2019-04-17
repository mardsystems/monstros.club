import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MedidasCadastroComponent } from './medidas-cadastro.component';

describe('MedidasCadastroComponent', () => {
  let component: MedidasCadastroComponent;
  let fixture: ComponentFixture<MedidasCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedidasCadastroComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidasCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
