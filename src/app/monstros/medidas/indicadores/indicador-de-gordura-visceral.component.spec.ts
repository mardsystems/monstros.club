import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadorDeGorduraVisceralComponent } from './indicador-de-gordura-visceral.component';

describe('IndicadorDeGorduraVisceralComponent', () => {
  let component: IndicadorDeGorduraVisceralComponent;
  let fixture: ComponentFixture<IndicadorDeGorduraVisceralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicadorDeGorduraVisceralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicadorDeGorduraVisceralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
