import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Workspace } from './pages/workspace/workspace';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Workspace }
    ]
  }
];
