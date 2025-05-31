import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from '../Filters';
import { ProductContext } from '../../context/ProductContext';
import React from 'react';

// Tipado mínimo necesario
type Filters = {
  name: string;
  categories: string[];
  availability: 'all' | 'inStock' | 'outOfStock';
};

const mockSetFilters = vi.fn();

const categoriesMock = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Books' },
];

const mockProducts = [
  {
    id: '1',
    name: 'Laptop',
    category: 'Electronics',
    quantityInStock: 5,
    unitPrice: 1000,
  },
  {
    id: '2',
    name: 'Book',
    category: 'Books',
    quantityInStock: 0,
    unitPrice: 20,
  },
];

const renderWithContext = (filtersOverride: Partial<Filters> = {}) => {
  const filters: Filters = {
    name: '',
    categories: [],
    availability: 'all',
    ...filtersOverride,
  };

  const contextValue = {
    products: mockProducts,
    selectedProduct: null,
    modalOpen: false,
    pagination: { page: 1, pageSize: 10 },
    openEditModal: vi.fn(),
    closeModal: vi.fn(),
    createOrUpdateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    toggleOutOfStock: vi.fn(),
    setPage: vi.fn(),
    filters,
    setFilters: mockSetFilters,
    categories: categoriesMock,
    addCategory: vi.fn(),
  };

  return render(
    <ProductContext.Provider value={contextValue as any}>
      <Filters />
    </ProductContext.Provider>
  );
};

describe('Filters Component', () => {
  beforeEach(() => {
    mockSetFilters.mockClear();
  });

  it('renders correctly', () => {
    renderWithContext();
    expect(screen.getByText('Filter Products')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'In Stock' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeInTheDocument();
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('updates name filter', () => {
    renderWithContext();
    const input = screen.getByLabelText('Filter by name');
    fireEvent.change(input, { target: { value: 'New Product' } });
    expect((input as HTMLInputElement).value).toBe('New Product');
  });

  it('clears filters on button click', () => {
    renderWithContext({
      name: 'Laptop',
      categories: ['Books'],
      availability: 'inStock',
    });

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    expect(mockSetFilters).toHaveBeenCalledWith({
      name: '',
      categories: [],
      availability: 'all',
    });
  });

  it('applies filters on search', () => {
    renderWithContext();
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    expect(mockSetFilters).toHaveBeenCalled();
  });

  it('toggles availability', () => {
    renderWithContext();
    fireEvent.click(screen.getByRole('button', { name: 'In Stock' }));
    fireEvent.click(screen.getByRole('button', { name: 'Out of Stock' }));
    expect(screen.getByText('Showing 2 products.')).toBeInTheDocument();
  });
});
