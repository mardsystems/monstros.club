import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorDeGorduraComponent } from './indicador-de-gordura.component';

describe('IndicadorDeGorduraComponent', () => {
  let component: IndicadorDeGorduraComponent;
  let fixture: ComponentFixture<IndicadorDeGorduraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndicadorDeGorduraComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorDeGorduraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
