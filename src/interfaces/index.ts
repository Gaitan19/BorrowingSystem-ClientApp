export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface IRequest {
  id: string;
  description: string;
  requestedByUserId: string;
  requestStatus: 'Pending' | 'Approved' | 'Rejected';
  returnStatus: 'Pending' | 'Returned';
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