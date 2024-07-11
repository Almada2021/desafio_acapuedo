export interface Debt {
    id: number;
    status: string;
    value: number;
    payUrl: string;
    label: string;
    docId?: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
  }