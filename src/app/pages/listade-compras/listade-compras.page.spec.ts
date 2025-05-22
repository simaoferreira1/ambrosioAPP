import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadeComprasPage } from './listade-compras.page';

describe('ListadeComprasPage', () => {
  let component: ListadeComprasPage;
  let fixture: ComponentFixture<ListadeComprasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadeComprasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
