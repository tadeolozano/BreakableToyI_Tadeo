import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductContext } from '../../context/ProductContext';
import MetricPanel from '../MetricPanel';

const mockProducts = [
    {
        id: '1',
        name: 'Test Product',
        category: 'Electronics',
        unitPrice: 99.99,
        quantityInStock: 5,
        expirationDate: '2025-06-07',
    },
    {
        id: '2',
        name: 'Apple',
        category: 'Food',
        unitPrice: 2.5,
        quantityInStock: 15,
        expirationDate: '2025-11-30',
    },
    {
        id: '3',
        name: 'Almost Expired',
        category: 'Food',
        unitPrice: 1,
        quantityInStock: 8,
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ahead
    },
    {
        id: '4',
        name: 'Low Stock',
        category: 'Food',
        unitPrice: 2,
        quantityInStock: 2,
        expirationDate: null,
    },
    {
        id: '5',
        name: 'Out of Stock',
        category: 'Food',
        unitPrice: 3,
        quantityInStock: 0,
        expirationDate: null,
    },
];

const contextMock = {
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
    filters: { name: '', categories: [], availability: 'all' },
};

describe('MetricPanel', () => {
    beforeEach(() => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <MetricPanel />
            </ProductContext.Provider>
        );
    });

    it('renders the component', () => {
        expect(screen.getByText('Inventory Metrics')).toBeInTheDocument();
    });

    it('displays total value', () => {
        expect(screen.getByText(/Total Stock/i)).toHaveTextContent('30');
    });

    it('displays total value of products', () => {
        //calculate total value
        const totalValue = mockProducts.reduce((acc, product) => {
            return acc + (product.unitPrice * product.quantityInStock);
        }, 0);
        expect(screen.getByText(/Total Value/i)).toHaveTextContent(totalValue.toFixed(2));
    });

    it('displays average price', () => {
        const productsWithStock = mockProducts.filter(p => p.quantityInStock > 0);
        const priceSum = productsWithStock.reduce((acc, p) => acc + p.unitPrice, 0);
        const count = productsWithStock.length;
        const averagePrice = count > 0 ? (priceSum / count).toFixed(2) : '0.00';
      
        const averagePriceRow = screen.getByText(/Average Price/i).closest('p'); // o Box
        expect(averagePriceRow).toHaveTextContent(`$${averagePrice}`);
      });
      

    
});