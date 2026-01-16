import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ReminderListComponent } from "../pages/reminder-list/reminder-list.component";

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, CommonModule, SidebarComponent, ReminderListComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})

export class MainLayout {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    if (window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
  }
}
