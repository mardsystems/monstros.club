import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMonstrosMedidasComponent } from './admin-monstros-medidas.component';

describe('AdminMonstrosMedidasComponent', () => {
  let component: AdminMonstrosMedidasComponent;
  let fixture: ComponentFixture<AdminMonstrosMedidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMonstrosMedidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMonstrosMedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
