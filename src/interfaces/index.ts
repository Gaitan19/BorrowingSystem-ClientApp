export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  password?: string; // Solo para crear o editar
}

// src/interfaces/index.ts
export interface IRequest {
  id: string;
  description: string;
  requestedByUserId: string;
  requestStatus: 0 | 1 | 2; // Pending | Approved | Rejected
  returnStatus: 0 | 1; // Pending | Returned
  requestDate: string;
  requestItems: IRequestItem[];
}

export interface IRequestItem {
  itemId: string;
  quantity: number;
}

export interface IItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
}