import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarAlimentoPage } from './adicionar-alimento.page';

describe('AdicionarAlimentoPage', () => {
  let component: AdicionarAlimentoPage;
  let fixture: ComponentFixture<AdicionarAlimentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarAlimentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
