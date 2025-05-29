import React, { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Box,
  Slide,
  Snackbar,
  Alert,
  type SlideProps
} from '@mui/material';
import { ProductContext } from '../context/ProductContext';
import { type Product } from '../models/Product';

const defaultForm: Product = {
  name: '',
  category: '',
  unitPrice: 0,
  quantityInStock: 0,
  expirationDate: '',
};

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateEditModal: React.FC = () => {
  const {
    modalOpen,
    closeModal,
    selectedProduct,
    createOrUpdateProduct,
    categories,
  } = useContext(ProductContext);

  const [form, setForm] = useState<Product>(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(selectedProduct ?? defaultForm);
  }, [selectedProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'unitPrice' || name === 'quantityInStock' ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Required';
    if (!form.category.trim()) newErrors.category = 'Required';
    if (!form.unitPrice) newErrors.unitPrice = 'Required';
    if (!form.quantityInStock && form.quantityInStock !== 0) newErrors.quantityInStock = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await createOrUpdateProduct(form);
    setSnackOpen(true);
    setSaved(true);
  };

  const handleCloseSnack = () => {
    setSnackOpen(false);
    setSaved(false);
  };

  return (
    <>
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 3,
            background: '#fdfdfd',
            boxShadow: 8
          },
        }}
      >
        <DialogTitle>
          <Typography fontSize={20} fontWeight="bold" color="primary">
            {form.id ? 'Edit Product' : 'New Product'}
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              variant="outlined"
              color={errors.name ? 'error' : 'success'}
            />
            <TextField
              label="Category"
              name="category"
              select
              value={form.category}
              onChange={handleChange}
              error={!!errors.category}
              helperText={errors.category}
              fullWidth
              color={errors.category ? 'error' : 'success'}
            >
              {categories.map(cat => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Unit Price"
              name="unitPrice"
              type="number"
              value={form.unitPrice}
              onChange={handleChange}
              error={!!errors.unitPrice}
              helperText={errors.unitPrice}
              fullWidth
              color={errors.unitPrice ? 'error' : 'success'}
            />
            <TextField
              label="Stock Quantity"
              name="quantityInStock"
              type="number"
              value={form.quantityInStock}
              onChange={handleChange}
              error={!!errors.quantityInStock}
              helperText={errors.quantityInStock}
              fullWidth
              color={errors.quantityInStock ? 'error' : 'success'}
            />
            <TextField
              label="Expiration Date"
              name="expirationDate"
              type="date"
              value={form.expirationDate || ''}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={closeModal} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={saved ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {saved ? 'Product saved successfully!' : 'Failed to save product.'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateEditModal;
