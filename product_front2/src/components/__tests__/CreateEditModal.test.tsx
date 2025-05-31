import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateEditModal from '../CreateEditModal';
import { ProductContext } from '../../context/ProductContext';
import type { Product } from '../../models/Product';
import userEvent from '@testing-library/user-event';


const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  category: 'Food',
  unitPrice: 10,
  quantityInStock: 5,
  expirationDate: '2025-12-31',
};

describe('CreateEditModal', () => {
  const mockClose = vi.fn();
  const mockSave = vi.fn();

  beforeEach(() => {
    mockClose.mockReset();
    mockSave.mockReset();
  });

  const renderWithContext = (selected: Product | null = null) =>
    render(
      <ProductContext.Provider
        value={{
          modalOpen: true,
          closeModal: mockClose,
          selectedProduct: selected,
          createOrUpdateProduct: mockSave,
          categories: [{ id: '1', name: 'Food' }, { id: '2', name: 'Drinks' }],
        } as any}
      >
        <CreateEditModal />
      </ProductContext.Provider>
    );

  it('renders the modal with empty form for new product', () => {
    renderWithContext();

    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('renders with existing product data', () => {
    renderWithContext(mockProduct);

    expect(screen.getByLabelText(/Name/i)).toHaveValue(mockProduct.name);
    expect(screen.getByLabelText(/Category/i)).toHaveTextContent(mockProduct.category);
    expect(screen.getByLabelText(/Unit Price/i)).toHaveValue(mockProduct.unitPrice);
    expect(screen.getByLabelText(/Stock/i)).toHaveValue(mockProduct.quantityInStock);
    expect(screen.getByLabelText(/Expiration Date/i)).toHaveValue(mockProduct.expirationDate);
  });

  it('validates empty fields before save', async () => {
    renderWithContext();
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(await screen.findAllByText(/Required/i)).toHaveLength(3);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('submits valid form', async () => {
    const user = userEvent.setup();
    renderWithContext();
  
    await user.type(screen.getByLabelText(/Name/i), 'New Product');
  
    // Interactuar con el select de categoría
    await user.click(screen.getByLabelText(/Category/i));
    await user.click(screen.getByRole('option', { name: 'Drinks' }));
  
    await user.clear(screen.getByLabelText(/Unit Price/i));
    await user.type(screen.getByLabelText(/Unit Price/i), '5');
  
    await user.clear(screen.getByLabelText(/Stock/i));
    await user.type(screen.getByLabelText(/Stock/i), '2');
  
    await user.click(screen.getByRole('button', { name: /Save/i }));
  
    expect(mockSave).toHaveBeenCalled();
  });
});
