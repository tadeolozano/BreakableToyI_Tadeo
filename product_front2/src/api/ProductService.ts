import type { Category } from '../models/Category';
import { type Product } from '../models/Product';

export async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Error al obtener productos');
  return await response.json();
}

export const createProduct = async (
  product: Omit<Product, 'id' | 'creationDate' | 'updateDate'>
): Promise<Product> => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Error al crear producto');
  return response.json();
};

export async function updateProduct(product: Product): Promise<Product> {
  const response = await fetch(`/api/products/${product.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return await response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete product');
}

export async function markAsOutOfStock(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}/outofstock`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to mark as out of stock');
}

export async function markAsInStock(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}/instock`, { method: 'PUT' });
  if (!response.ok) throw new Error('Failed to mark as in stock');
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch('/api/categories');
  console.log(response);
  if (!response.ok) throw new Error('Error al obtener categorías');
  return await response.json();
}

export async function createCategory(name: string): Promise<{ id: string; name: string }> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) throw new Error('Error al crear categoría');

  return await response.json();
}


