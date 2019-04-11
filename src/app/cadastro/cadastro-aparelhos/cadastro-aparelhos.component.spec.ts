import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroAparelhosComponent } from './cadastro-aparelhos.component';

describe('CadastroAparelhosComponent', () => {
  let component: CadastroAparelhosComponent;
  let fixture: ComponentFixture<CadastroAparelhosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroAparelhosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroAparelhosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
