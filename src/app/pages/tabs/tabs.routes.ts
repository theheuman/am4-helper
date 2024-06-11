import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'prices',
        loadComponent: () =>
          import('../prices/prices.page').then((m) => m.PricesPage),
      },
      {
        path: 'calculator',
        loadComponent: () =>
          import('../calculator/calculator.page').then((m) => m.CalculatorPage),
      },
      {
        path: 'guides',
        loadComponent: () =>
          import('../guides/guides.page').then((m) => m.GuidesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/prices',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/prices',
    pathMatch: 'full',
  },
];
