import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FazerScanPage } from './fazer-scan.page';

describe('FazerScanPage', () => {
  let component: FazerScanPage;
  let fixture: ComponentFixture<FazerScanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FazerScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
