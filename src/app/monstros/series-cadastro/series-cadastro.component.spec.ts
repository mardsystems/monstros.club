import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesCadastroComponent } from './series-cadastro.component';

describe('SeriesCadastroComponent', () => {
  let component: SeriesCadastroComponent;
  let fixture: ComponentFixture<SeriesCadastroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeriesCadastroComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
