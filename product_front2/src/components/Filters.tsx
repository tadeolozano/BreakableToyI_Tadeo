import React, { useContext, useState } from 'react';
import {
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Typography,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ProductContext } from '../context/ProductContext';

const Filters: React.FC = () => {
  const { filters, setFilters, categories, products } = useContext(ProductContext);

  const [localFilters, setLocalFilters] = useState(filters);

  const handleClear = () => {
    const cleared: typeof filters = {
      name: '',
      categories: [],
      availability: 'all',
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  const handleSearch = () => {
    setFilters(localFilters); // Apply search on click
  };

  const handleAvailabilityChange = (_: unknown, value: string | null) => {
    if (value !== null) {
      setLocalFilters(prev => ({ ...prev, availability: value as any }));
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        Filter Products
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Filter by name"
          value={localFilters.name}
          onChange={(e) => setLocalFilters(prev => ({ ...prev, name: e.target.value }))}
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            multiple
            value={localFilters.categories}
            onChange={(e) =>
              setLocalFilters(prev => ({ ...prev, categories: e.target.value as string[] }))
            }
            input={<OutlinedInput label="Category" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                <Checkbox checked={localFilters.categories.includes(cat.name)} />
                <ListItemText primary={cat.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          fullWidth
          exclusive
          color="primary"
          value={localFilters.availability}
          onChange={handleAvailabilityChange}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="inStock">In Stock</ToggleButton>
          <ToggleButton value="outOfStock">Out of Stock</ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button variant="outlined" onClick={handleClear} color="secondary">
            Clear Filters
          </Button>
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Showing {products.length} product{products.length !== 1 && 's'}.
        </Typography>
      </Stack>
    </Paper>
  );
};

export default Filters;
