import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMonstrosComponent } from './admin-monstros.component';

describe('AdminMonstrosComponent', () => {
  let component: AdminMonstrosComponent;
  let fixture: ComponentFixture<AdminMonstrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMonstrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMonstrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
