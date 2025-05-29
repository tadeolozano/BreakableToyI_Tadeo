import React, { useContext } from 'react';
import { Box, Button, Typography, Container, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ProductContext } from '../context/ProductContext';
import Filters from '../components/Filters';
import ProductTable from '../components/ProductTable';
import MetricsPanel from '../components/MetricPanel';
import CreateEditModal from '../components/CreateEditModal';

const InventoryPage: React.FC = () => {
  const { openEditModal } = useContext(ProductContext);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3} alignItems="center">
        {/* Header */}
        <Typography variant="h4">Inventory Manager</Typography>

        {/* Filters */}
        <Box width="100%">
          <Filters />
        </Box>

        {/* Button aligned to the left */}
        <Box display="flex" justifyContent="flex-end" my={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openEditModal(null)}
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
              boxShadow: 3,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Product Table */}
        <Box width="100%">
          <ProductTable />
        </Box>

        {/* Metrics Panel */}
        <Box width="100%" maxWidth="600px">
          <MetricsPanel />
        </Box>

        {/* Modal */}
        <CreateEditModal />
      </Stack>
    </Container>
  );
};

export default InventoryPage;
