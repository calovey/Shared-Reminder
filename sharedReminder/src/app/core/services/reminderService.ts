import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reminder } from '../models/reminderModel';
import { Auth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })

export class ReminderService {
    constructor(
        private _firestoreService: Firestore,
        private _authService: Auth
    ) { }

    private firestore = inject(Firestore);
    private auth = inject(Auth);

    private getCollection(workspaceCode: string) {
        return collection(
            this.firestore,
            `workspaces/${workspaceCode}/reminders`
        );
    }

    getReminders(workspaceCode: string): Observable<Reminder[]> {
        const remindersRef = this.getCollection(workspaceCode);
        const q = query(remindersRef, orderBy('createdAt', 'desc'));

        return collectionData(q, { idField: 'id' }) as Observable<Reminder[]>;
    }

    async addReminder(workspaceCode: string, text: string) {
        const user = this.auth.currentUser;
        if (!user) throw new Error('User not authenticated');

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

        const reminderDoc = doc(this.firestore, `workspaces/${workspaceCode}/reminders/${reminder.id}`);
        await updateDoc(reminderDoc, { completed: !reminder.completed });
    }

    async deleteReminder(workspaceCode: string, reminderId: string) {
        const reminderDoc = doc(this.firestore, `workspaces/${workspaceCode}/reminders/${reminderId}`);
        await deleteDoc(reminderDoc);
    }
}
