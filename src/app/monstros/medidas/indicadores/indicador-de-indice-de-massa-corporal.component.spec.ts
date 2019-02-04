import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorDeIndiceDeMassaCorporalComponent } from './indicador-de-indice-de-massa-corporal.component';

describe('IndicadorDeIndiceDeMassaCorporalComponent', () => {
  let component: IndicadorDeIndiceDeMassaCorporalComponent;
  let fixture: ComponentFixture<IndicadorDeIndiceDeMassaCorporalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorDeIndiceDeMassaCorporalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorDeIndiceDeMassaCorporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
