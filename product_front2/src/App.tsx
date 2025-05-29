import React from 'react';
import { ProductProvider } from './context/ProductContext';
import InventoryPage from './pages/InventoryPage';
import { CssBaseline, Container } from '@mui/material';

const App: React.FC = () => {
  return (
    <ProductProvider>
      <CssBaseline />
      <Container maxWidth="lg">
        <InventoryPage />
      </Container>
    </ProductProvider>
  );
};

export default App;
