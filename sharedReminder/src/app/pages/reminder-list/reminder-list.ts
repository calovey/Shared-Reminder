import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Reminder } from '../../core/models/reminderModel';
import { ReminderService } from '../../core/services/reminderService';
import { WorkspaceService } from '../../core/services/workspaceService';

@Component({
  standalone: true,
  selector: 'app-reminder-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-list.html',
  styleUrl: './reminder-list.scss',
})
export class ReminderListComponent implements OnInit, OnDestroy {
  workspaceCode = '';
  reminders: Reminder[] = [];
  newReminder = '';

  private remindersSubscription?: Subscription;

  constructor(
    private _reminderService: ReminderService,
    private _workspaceService: WorkspaceService,
    private _cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    this.workspaceCode = await this._workspaceService.getOrCreateWorkspace();
    this.loadReminders();
  }

  ngOnDestroy() {
    this.remindersSubscription?.unsubscribe();
  }

  loadReminders() {
    this.remindersSubscription?.unsubscribe();
    this.remindersSubscription = this._reminderService.getReminders(this.workspaceCode).subscribe((items) => {
      this.reminders = items;
      this._cdr.detectChanges();
    });
  }

  async addReminder() {
    if (!this.newReminder.trim()) return;

    await this._reminderService.addReminder(this.workspaceCode, this.newReminder.trim());
    this.newReminder = '';
    this._cdr.detectChanges();
  }

  async toggleComplete(reminder: Reminder) {
    await this._reminderService.toggleComplete(this.workspaceCode, reminder);
    reminder.completed = !reminder.completed;
    this._cdr.detectChanges();
  }

  async deleteReminder(reminder: Reminder) {
    if (!reminder.id) return;

    try {
      await this._reminderService.deleteReminder(this.workspaceCode, reminder.id);
      this.reminders = this.reminders.filter(r => r.id !== reminder.id);
      this._cdr.detectChanges();
    } catch (error) {
      console.error('error', error);
    }
  }
}
