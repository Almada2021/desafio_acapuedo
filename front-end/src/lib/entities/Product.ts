export default interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  