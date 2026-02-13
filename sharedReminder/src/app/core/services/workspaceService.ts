import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, serverTimestamp, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
    private storageKey = 'activeWorkspaceCode';

    constructor(private _firestore: Firestore,
        private _router: Router,
        private _auth: Auth
    ) { }


    //#region Helper Methods
    // if LocalStorage doesnt exist create
    async getOrCreateWorkspace(): Promise<string> {
        const local = this.getLocalWorkspaceCode();
        if (local) return local;

        return await this.createWorkspace();
    }

    getLocalWorkspaceCode(): string | null {
        return localStorage.getItem(this.storageKey);
    }

    setLocalWorkspaceCode(code: string) {
        localStorage.setItem(this.storageKey, code);
    }

    clearLocalWorkspace() {
        localStorage.removeItem(this.storageKey);
    }

    getActiveCode(): string | null {
        return localStorage.getItem(this.storageKey);
    }

    setActiveCode(code: string) {
        localStorage.setItem(this.storageKey, code);
    }

    // Generate Code
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
    //#endregion

    async workspaceExists(code: string): Promise<boolean> {
        const ref = doc(this._firestore, `workspaces/${code}`);
        const snap = await getDoc(ref);
        return snap.exists();
    }

    async createWorkspace(): Promise<string> {
        const uid = this._auth.currentUser?.uid ?? null;

        for (let i = 0; i < 5; i++) {
            const code = this.generateWorkspaceCode(6);
            const ref = doc(this._firestore, `workspaces/${code}`);

            const snap = await getDoc(ref);
            if (snap.exists()) continue;

            await setDoc(ref, {
                createdAt: serverTimestamp(),
                createdBy: uid,
                members: uid ? [uid] : []
            });

            this.setLocalWorkspaceCode(code);
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

        const uid = this._auth.currentUser?.uid ?? null;

        if (uid) {
            await updateDoc(ref, {
                members: arrayUnion(uid)
            });
        }

        this.setLocalWorkspaceCode(cleaned);
    }
}
