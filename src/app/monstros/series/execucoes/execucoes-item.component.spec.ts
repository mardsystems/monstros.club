import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecucoesItemComponent } from './execucoes-item.component';

describe('ExecucoesItemComponent', () => {
  let component: ExecucoesItemComponent;
  let fixture: ComponentFixture<ExecucoesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExecucoesItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecucoesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
