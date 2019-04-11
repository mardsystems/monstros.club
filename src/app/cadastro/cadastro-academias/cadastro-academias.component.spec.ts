import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroAcademiasComponent } from './cadastro-academias.component';

describe('CadastroAcademiasComponent', () => {
  let component: CadastroAcademiasComponent;
  let fixture: ComponentFixture<CadastroAcademiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroAcademiasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroAcademiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
