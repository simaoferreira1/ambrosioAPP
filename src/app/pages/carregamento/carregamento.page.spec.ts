import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarregamentoPage } from './carregamento.page';

describe('CarregamentoPage', () => {
  let component: CarregamentoPage;
  let fixture: ComponentFixture<CarregamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarregamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
