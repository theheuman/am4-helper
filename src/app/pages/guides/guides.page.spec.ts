import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidesPage } from './guides.page';

describe('Tab1Page', () => {
  let component: GuidesPage;
  let fixture: ComponentFixture<GuidesPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(GuidesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
