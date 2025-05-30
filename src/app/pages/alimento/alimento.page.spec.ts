import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlimentoPage } from './alimento.page';

describe('AlimentoPage', () => {
  let component: AlimentoPage;
  let fixture: ComponentFixture<AlimentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
