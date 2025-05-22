import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InserirManualmentePage } from './inserir-manualmente.page';

describe('InserirManualmentePage', () => {
  let component: InserirManualmentePage;
  let fixture: ComponentFixture<InserirManualmentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InserirManualmentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
