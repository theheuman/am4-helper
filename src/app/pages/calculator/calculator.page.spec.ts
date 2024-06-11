import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorPage } from './calculator.page';

describe('Tab3Page', () => {
  let component: CalculatorPage;
  let fixture: ComponentFixture<CalculatorPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(CalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
