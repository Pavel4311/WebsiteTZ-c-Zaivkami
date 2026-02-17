export interface Request {
    clientName: string;
    phone: string;
    address: string;
    problemText: string;
    status: 'pending' | 'in-progress' | 'completed' | 'canceled';
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    name: string;
    role: 'admin' | 'user';
    password: string;
}