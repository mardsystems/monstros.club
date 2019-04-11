import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcademiasCadastroComponent } from './academias-cadastro.component';

describe('AcademiasCadastroComponent', () => {
  let component: AcademiasCadastroComponent;
  let fixture: ComponentFixture<AcademiasCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcademiasCadastroComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademiasCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
