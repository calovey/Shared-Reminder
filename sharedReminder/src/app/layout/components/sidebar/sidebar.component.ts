import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  lists = [
    { id: 'unforgettable', name: 'Unforgettable', route: '/reminders/unforgettable' },
    { id: 'shopping', name: 'Shopping', route: '/reminders/shopping' },
    { id: 'todos', name: 'Todos', route: '/reminders/todos' }
  ];

  activeList = 'unforgettable';

  constructor(private router: Router) { }

  onListClick(list: any) {
    this.activeList = list.id;
    this.router.navigate([list.route]);
    this.closeMenu.emit();
  }

  onNewList() {
    console.log('Create new list');
  }
}
