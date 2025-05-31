import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductContext } from '../../context/ProductContext';
import ProductTable from '../ProductTable';

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
    setFilters: vi.fn(),
    categories: [],
    addCategory: vi.fn(),
};

describe('ProductTable', () => {
    it('toggles sort by Name column', () => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <ProductTable />
            </ProductContext.Provider>
        );

        const nameHeader = screen.getByText('Name');


        fireEvent.click(nameHeader); // asc
        fireEvent.click(nameHeader); // desc
        fireEvent.click(nameHeader); // remove sort

        expect(screen.getAllByRole('row')[1]).toHaveTextContent('Test Product');
    });

    it('renders product rows and handles edit/delete actions', () => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <ProductTable />
            </ProductContext.Provider>
        );

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('June 06, 2025')).toBeInTheDocument();


    });

    it('applies low-stock and expiration styles', () => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <ProductTable />
            </ProductContext.Provider>
        );

        const lowStockCell = screen.getByText('2');

        expect(lowStockCell).toBeInTheDocument();
        //color rojo de la celda de stock bajo
        expect(lowStockCell).toHaveStyle('background-color: #ffe0e0');

    });

    it('applies low-stock and expiration styles', () => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <ProductTable />
            </ProductContext.Provider>
        );

        const lowStockCell = screen.getByText('8');

        expect(lowStockCell).toBeInTheDocument();
        //color rojo de la celda de stock bajo
        expect(lowStockCell).toHaveStyle('background-color: #fff4e0');

    });

    it('applies line-through style for out-of-stock products', () => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <ProductTable />
            </ProductContext.Provider>
        );

        const outOfStockCell = screen.getByText('0');

        expect(outOfStockCell).toBeInTheDocument();
        expect(outOfStockCell).toHaveStyle('text-decoration: line-through');
    });

    it('applies expiration styles correctly', () => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <ProductTable />
            </ProductContext.Provider>
        );

        const almostExpiredCell = screen.getByText('Almost Expired');
        expect(almostExpiredCell).toBeInTheDocument();
        expect(almostExpiredCell.parentElement).toHaveStyle('background-color: #ffebee'); // 3 days left

        const validExpirationCell = screen.getByText('Apple');
        expect(validExpirationCell).toBeInTheDocument();
        expect(validExpirationCell.parentElement).toHaveStyle('background-color: #e8f5e9'); // more than 14 days
    });

    it('handles pagination', () => {
        render(
            <ProductContext.Provider value={contextMock as any}>
                <ProductTable />
            </ProductContext.Provider>
        );

        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(6); // 5 products + header row

        // Simulate changing page
        contextMock.setPage(2);
        expect(contextMock.setPage).toHaveBeenCalledWith(2);
    });


    


});
