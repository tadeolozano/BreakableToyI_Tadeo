import React, { useContext, useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, IconButton, TablePagination, TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductContext } from '../context/ProductContext';
import { format, differenceInDays } from 'date-fns';

type SortField = 'category' | 'name' | 'unitPrice' | 'expirationDate' | 'quantityInStock';
type SortDirection = 'asc' | 'desc';

type SortOption = { field: SortField; direction: SortDirection };

const ProductTable: React.FC = () => {
  const {
    products,
    toggleOutOfStock,
    deleteProduct,
    openEditModal,
    pagination,
    setPage,
  } = useContext(ProductContext);

  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);

  const cycleSort = (field: SortField) => {
    setSortOptions(prev => {
      const existing = prev.find(opt => opt.field === field);
      if (!existing) return [...prev, { field, direction: 'asc' }];
      if (existing.direction === 'asc') {
        return prev.map(opt => opt.field === field ? { ...opt, direction: 'desc' } : opt);
      }
      
      return prev.filter(opt => opt.field !== field);
    });
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    for (let i = sortOptions.length - 1; i >= 0; i--) {
      const { field, direction } = sortOptions[i];
      sorted.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [products, sortOptions]);

  const currentPage = pagination.page - 1;
  const rowsPerPage = pagination.pageSize;

  const paginated = sortedProducts.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const getRowStyle = (expirationDate?: string | null) => {
    if (!expirationDate) return {};
    const days = differenceInDays(new Date(expirationDate), new Date());
    if (days < 7) return { backgroundColor: '#ffebee' };
    if (days < 14) return { backgroundColor: '#fffde7' };
    return { backgroundColor: '#e8f5e9' };
  };

  const getStockStyle = (stock: number) => {
    if (stock === 0) return { backgroundColor: '#ffcccc', textDecoration: 'line-through' };
    if (stock < 5) return { backgroundColor: '#ffe0e0' };
    if (stock <= 10) return { backgroundColor: '#fff4e0' };
    return { backgroundColor: '#f0fff0' };
  };

  const getLineTrough = (stock: number) => {
    if (stock === 0) return{ textDecoration: 'line-through'};
    return;
  }

  const handleChangePage = (_:unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const headers: { label: string; field: SortField }[] = [
    { label: 'Category', field: 'category' },
    { label: 'Name', field: 'name' },
    { label: 'Price', field: 'unitPrice' },
    { label: 'Expiration', field: 'expirationDate' },
    { label: 'Stock', field: 'quantityInStock' },
  ];

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Out</TableCell>
              {headers.map(({ label, field }) => {
                const active = sortOptions.find(opt => opt.field === field);
                return (
                  <TableCell key={field}>
                    <TableSortLabel
                      active={!!active}
                      direction={active?.direction ?? 'asc'}
                      onClick={() => cycleSort(field)}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((product) => (
              <TableRow key={product.id} sx={getRowStyle(product.expirationDate)}>
                <TableCell>
                  <Checkbox
                    checked={product.quantityInStock === 0}
                    onChange={() => product.id && toggleOutOfStock(product.id)}
                  />
                </TableCell>
                <TableCell sx={getLineTrough(product.quantityInStock)}>{product.category}</TableCell>
                <TableCell sx={getLineTrough(product.quantityInStock)}>{product.name}</TableCell>
                <TableCell sx={getLineTrough(product.quantityInStock)}>${product.unitPrice.toFixed(2)}</TableCell>
                <TableCell sx={getLineTrough(product.quantityInStock)}>
                    {product.expirationDate
                    ? format(new Date(product.expirationDate), 'MMMM dd, yyyy')
                    : '—'}
                </TableCell>
                <TableCell sx={getStockStyle(product.quantityInStock)}>{product.quantityInStock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditModal(product)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => product.id && deleteProduct(product.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={products.length}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[10]}
      />
    </Paper>
  );
};

export default ProductTable;
