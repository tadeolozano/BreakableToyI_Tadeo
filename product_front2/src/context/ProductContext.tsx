import React, { createContext, useEffect, useMemo, useState } from 'react';
import { type Product } from '../models/Product';
import { type Category } from '../models/Category';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  markAsInStock,
  markAsOutOfStock,
  getCategories,
  createCategory,
} from '../api/ProductService';
import { Snackbar } from '@mui/material';

type Filters = {
  name: string;
  categories: string[];
  availability: 'all' | 'inStock' | 'outOfStock';
};

interface ProductContextType {
  products: Product[];
  selectedProduct: Product | null;
  modalOpen: boolean;
  pagination: { page: number; pageSize: number };
  openEditModal: (product: Product | null) => void;
  closeModal: () => void;
  createOrUpdateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleOutOfStock: (id: string) => void;
  setPage: (p: number) => void;
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: Category[];
  addCategory: (name: string) => Promise<void>;
}


export const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filters, setFilters] = useState<Filters>({
    name: '',
    categories: [],
    availability: 'all',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setAllProducts(data);
    } catch (err) {
      console.error('Error loading products', err);
      setMessage('Error loading products');
    }
  };

  

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories', err);
      setMessage('Error loading categories');
    }
  };

  const addCategory = async (name: string) => {
    try {
      const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase());
      if (exists) return;
      const newCat = await createCategory(name);
      setCategories(prev => [...prev, newCat]);
    } catch (e) {
      setMessage('Error creando categoría');
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchesName = product.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesCategory =
        filters.categories.length === 0 || filters.categories.includes(product.category);
      const matchesAvailability =
        filters.availability === 'all' ||
        (filters.availability === 'inStock' && product.quantityInStock > 0) ||
        (filters.availability === 'outOfStock' && product.quantityInStock === 0);
      return matchesName && matchesCategory && matchesAvailability;
    });
  }, [allProducts, filters]);

  const openEditModal = (product: Product | null) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  const createOrUpdateProduct = async (product: Product) => {
    try {
      if (product.id) {
        await updateProduct(product);
        setMessage('Product updated successfully');
      } else {
        const productToCreate = {
          ...product,
          expirationDate: product.expirationDate || null,
        };
        await createProduct(productToCreate);
        await loadProducts();
        setMessage('Product created successfully');
      }
      closeModal();
      await loadProducts();
      await loadCategories();
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage('Failed to save product');
    }
  };

  const deleteProductById = async (id: string) => {
    try {
      await deleteProduct(id);
      await loadProducts();
      setMessage('Product deleted successfully');
    } catch {
      setMessage('Failed to delete product');
    }
  };

  const toggleOutOfStock = async (id: string) => {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    try {
      if (product.quantityInStock === 0) {
        await markAsInStock(id);
        setMessage('Marked as in stock');
      } else {
        await markAsOutOfStock(id);
        setMessage('Marked as out of stock');
      }
      await loadProducts();
    } catch {
      setMessage('Failed to toggle stock status');
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products: filteredProducts,
        selectedProduct,
        modalOpen,
        pagination,
        openEditModal,
        closeModal,
        createOrUpdateProduct,
        deleteProduct: deleteProductById,
        toggleOutOfStock,
        setPage: (p) => setPagination(prev => ({ ...prev, page: p })),
        filters,
        setFilters,
        categories,
        addCategory,
      }}
    >
      {children}
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ProductContext.Provider>
  );
};
