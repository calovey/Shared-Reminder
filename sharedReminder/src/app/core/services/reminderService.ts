import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reminder } from '../models/reminderModel';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class ReminderService {
    constructor(
        private _firestore: Firestore,
        private _auth: Auth
    ) { }

    private getCollection(workspaceCode: string) {
        return collection(this._firestore, `workspaces/${workspaceCode}/reminders`);
    }

    getReminders(workspaceCode: string): Observable<Reminder[]> {
        const remindersRef = this.getCollection(workspaceCode);
        const q = query(remindersRef, orderBy('createdAt', 'desc'));

        return collectionData(q, { idField: 'id' }) as Observable<Reminder[]>;
    }

    async addReminder(workspaceCode: string, text: string) {
        const user = await this.requireAuth();
        const remindersRef = this.getCollection(workspaceCode);

        await addDoc(remindersRef, {
            text,
            completed: false,
            createdAt: serverTimestamp(),
            createdBy: user.uid
        });
    }

    async toggleComplete(workspaceCode: string, reminder: Reminder) {
        if (!reminder.id) return;

        await this.requireAuth();

        const reminderDoc = doc(
            this._firestore,
            `workspaces/${workspaceCode}/reminders/${reminder.id}`
        );

        await updateDoc(reminderDoc, { completed: !reminder.completed });
    }

    async deleteReminder(workspaceCode: string, reminderId: string) {
        await this.requireAuth();

        const reminderDoc = doc(
            this._firestore,
            `workspaces/${workspaceCode}/reminders/${reminderId}`
        );

        await deleteDoc(reminderDoc);
    }

    private async requireAuth() {
        await this._auth.authStateReady();

        const user = this._auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        await user.getIdToken();
        return user;
    }
}
