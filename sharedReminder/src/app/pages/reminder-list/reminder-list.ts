import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Reminder {
  id: number;
  text: string;
  time: string;
  completed: boolean;
}

@Component({
  standalone: true,
  selector: 'app-reminder-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-list.html',
  styleUrl: './reminder-list.scss',
})

export class ReminderListComponent implements OnInit {

  listName = '';
  newReminder = '';
  reminders: Reminder[] = [
    { id: 1, text: 'Buy groceries for weekend', time: '10:00 AM', completed: false },
    { id: 2, text: 'Call dentist for appointment', time: '2:30 PM', completed: false },
    { id: 3, text: 'Finish project presentation', time: '5:00 PM', completed: true },
  ];

  constructor(private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.listName = params['listname'] || 'unforgettable';
    });
  }

  addReminder() {
    if (this.newReminder.trim()) {
      const newItem: Reminder = {
        id: Date.now(),
        text: this.newReminder,
        time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        completed: false
      };
      this.reminders = [...this.reminders, newItem];
      this.newReminder = '';
    }
  }

  toggleComplete(id: number) {
    this.reminders = this.reminders.map(r =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
  }

  deleteReminder(id: number) {
    this.reminders = this.reminders.filter(r => r.id !== id);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.addReminder();
    }
  }

}
