export interface Reminder {
    id?: string;
    text: string;
    completed: boolean;
    createdAt?: any;
    createdBy?: string | null;
}
