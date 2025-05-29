export interface Product {
  id?: string;
  name: string;
  category: string;
  unitPrice: number;
  quantityInStock: number;
  expirationDate?: string | null;
  creationDate?: string;
  updateDate?: string;
}
