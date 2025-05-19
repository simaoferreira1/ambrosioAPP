import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelecionaralimentosPage } from './selecionaralimentos.page';

describe('SelecionaralimentosPage', () => {
  let component: SelecionaralimentosPage;
  let fixture: ComponentFixture<SelecionaralimentosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecionaralimentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
