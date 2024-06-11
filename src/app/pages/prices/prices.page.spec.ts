import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricesPage } from './prices.page';

describe('Tab2Page', () => {
  let component: PricesPage;
  let fixture: ComponentFixture<PricesPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PricesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
