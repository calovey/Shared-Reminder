import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';
//import { ReminderListComponent } from './pages/reminder-list/reminder-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'reminders/unforgettable', pathMatch: 'full' },
      //{ path: 'reminders/:listName', component: ReminderListComponent }
    ]
  }
];