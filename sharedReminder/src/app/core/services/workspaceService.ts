import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
    arrayUnion,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc
} from 'firebase/firestore';

interface UserProfileDoc {
    activeWorkspaceCode?: string | null;
}

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
    constructor(
        private _firestore: Firestore,
        private _auth: Auth
    ) { }

    async getOrCreateWorkspace(): Promise<string> {
        const user = await this.waitForAuth();
        const storedCode = await this.getStoredWorkspaceCode(user.uid);

        if (storedCode && await this.workspaceExists(storedCode)) {
            return storedCode;
        }

        return await this.createWorkspace();
    }

    async clearActiveWorkspace() {
        const user = await this.waitForAuth();
        await this.saveActiveWorkspaceCode(user.uid, null);
    }

    generateWorkspaceCode(length: number = 6): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }

        return result;
    }

    async workspaceExists(code: string): Promise<boolean> {
        const ref = doc(this._firestore, `workspaces/${code}`);
        const snap = await getDoc(ref);
        return snap.exists();
    }

    async createWorkspace(): Promise<string> {
        const user = await this.waitForAuth();
        const uid = user.uid;

        await this.ensureUserProfile(user.uid, user.email, user.displayName);
        await user.getIdToken();

        for (let i = 0; i < 5; i++) {
            const code = this.generateWorkspaceCode(6);
            const ref = doc(this._firestore, `workspaces/${code}`);
            const snap = await getDoc(ref);

            if (snap.exists()) continue;

            await setDoc(ref, {
                createdAt: serverTimestamp(),
                createdBy: uid,
                members: [uid]
            });

            await this.saveActiveWorkspaceCode(uid, code);
            return code;
        }

        throw new Error('Workspace code could not be generated.');
    }

    async joinWorkspace(code: string): Promise<void> {
        const cleaned = code.trim().toUpperCase();
        const ref = doc(this._firestore, `workspaces/${cleaned}`);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            throw new Error('Workspace not found.');
        }

        const user = await this.waitForAuth();

        await updateDoc(ref, {
            members: arrayUnion(user.uid)
        });

        await this.saveActiveWorkspaceCode(user.uid, cleaned);
    }

    private async getStoredWorkspaceCode(uid: string): Promise<string | null> {
        const userRef = this.getUserDocRef(uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            return null;
        }

        const data = snap.data() as UserProfileDoc;
        return data.activeWorkspaceCode ?? null;
    }

    private async saveActiveWorkspaceCode(uid: string, code: string | null) {
        await setDoc(this.getUserDocRef(uid), {
            activeWorkspaceCode: code
        }, { merge: true });
    }

    private async ensureUserProfile(uid: string, email: string | null, displayName: string | null) {
        await setDoc(this.getUserDocRef(uid), {
            email,
            displayName,
            createdAt: serverTimestamp()
        }, { merge: true });
    }

    private getUserDocRef(uid: string) {
        return doc(this._firestore, `users/${uid}`);
    }

    private async waitForAuth() {
        await this._auth.authStateReady();

        const user = this._auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        return user;
    }
}
