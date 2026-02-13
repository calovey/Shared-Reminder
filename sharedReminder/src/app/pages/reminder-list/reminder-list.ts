import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Reminder } from '../../core/models/reminderModel';
import { Observable } from 'rxjs';
import { ReminderService } from '../../core/services/reminderService';
import { WorkspaceService } from '../../core/services/workspaceService';

@Component({
  standalone: true,
  selector: 'app-reminder-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-list.html',
  styleUrl: './reminder-list.scss',
})

export class ReminderListComponent implements OnInit {

  workspaceCode = '';
  reminders: Reminder[] = [];
  newReminder = '';

  constructor(private _route: ActivatedRoute,
    private _reminderService: ReminderService,
    private _workspaceService: WorkspaceService,
  ) { }

  async ngOnInit() {
    this.workspaceCode = await this._workspaceService.getOrCreateWorkspace();

    this._reminderService.getReminders(this.workspaceCode).subscribe((items) => {
      this.reminders = items;
    });
  }

  async addReminder() {
    if (!this.newReminder.trim()) return;

    await this._reminderService.addReminder(this.workspaceCode, this.newReminder.trim());
    this.newReminder = '';
  }

  async toggleComplete(reminder: Reminder) {
    await this._reminderService.toggleComplete(this.workspaceCode, reminder);
  }

  async deleteReminder(reminder: Reminder) {
    if (!reminder.id) return;
    await this._reminderService.deleteReminder(this.workspaceCode, reminder.id);
  }
}
