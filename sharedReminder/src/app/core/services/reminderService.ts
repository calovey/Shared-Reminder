import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reminder } from '../models/reminderModel';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })

export class ReminderService {
    constructor(private _firestore: Firestore,
        private _auth: Auth
    ) { }

    getReminders(workspaceCode: string): Observable<Reminder[]> {
        const ref = collection(this._firestore, `workspaces/${workspaceCode}/reminders`);
        const q = query(ref, orderBy('createdAt', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Reminder[]>;
    }

    async addReminder(workspaceCode: string, text: string) {
        const uid = this._auth.currentUser?.uid ?? null;

        const ref = collection(this._firestore, `workspaces/${workspaceCode}/reminders`);
        await addDoc(ref, {
            text,
            completed: false,
            createdAt: serverTimestamp(),
            createdBy: uid
        });
    }

    async toggleComplete(workspaceCode: string, reminder: Reminder) {
        if (!reminder.id) return;

        const ref = doc(this._firestore, `workspaces/${workspaceCode}/reminders/${reminder.id}`);
        await updateDoc(ref, {
            completed: !reminder.completed
        });
    }
    async deleteReminder(workspaceCode: string, reminderId: string) {
        const ref = doc(this._firestore, `workspaces/${workspaceCode}/reminders/${reminderId}`);
        await deleteDoc(ref);
    }
}
