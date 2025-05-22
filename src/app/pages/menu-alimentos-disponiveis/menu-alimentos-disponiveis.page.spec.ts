import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuAlimentosDisponiveisPage } from './menu-alimentos-disponiveis.page';

describe('MenuAlimentosDisponiveisPage', () => {
  let component: MenuAlimentosDisponiveisPage;
  let fixture: ComponentFixture<MenuAlimentosDisponiveisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuAlimentosDisponiveisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
