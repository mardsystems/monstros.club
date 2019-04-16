import { TestBed } from '@angular/core/testing';
import { MonstrosCadastroService } from './monstros-cadastro-@.service';

describe('MonstrosCadastroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MonstrosCadastroService = TestBed.get(MonstrosCadastroService);
    expect(service).toBeTruthy();
  });
});
