import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'app',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'reminders/unforgettable',
        pathMatch: 'full'
      },
      // {
      //   path: 'reminders/:listName',
      //   loadComponent: () =>
      //     import('./pages/reminder-list/reminder-list.component')
      //       .then(m => m.ReminderListComponent)
      // }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];