import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
import { AuthShellComponent } from './pages/auth-shell/auth-shell';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthShellComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
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
      {
        path: 'reminders/:listName',
        loadComponent: () =>
          import('./pages/reminder-list/reminder-list')
            .then(m => m.ReminderListComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
