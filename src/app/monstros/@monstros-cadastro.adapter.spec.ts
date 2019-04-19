import { TestBed } from '@angular/core/testing';
import { MonstrosCadastroAdapter } from './@monstros-cadastro.adapter';

describe('MonstrosCadastroAdapter', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonstrosCadastroAdapter = TestBed.get(MonstrosCadastroAdapter);
    expect(service).toBeTruthy();
  });
});
