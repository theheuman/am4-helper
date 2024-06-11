import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../prices/prices.page').then((m) => m.PricesPage),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../calculator/calculator.page').then((m) => m.CalculatorPage),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../guides/guides.page').then((m) => m.GuidesPage),
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];
