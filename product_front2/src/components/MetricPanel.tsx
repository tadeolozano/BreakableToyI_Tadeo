import React, { useContext, useMemo } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Divider,
} from '@mui/material';
import { ProductContext } from '../context/ProductContext';

const MetricsPanel: React.FC = () => {
  const { products } = useContext(ProductContext);

  const metrics = useMemo(() => {
    let totalStock = 0;
    let totalValue = 0;
    let totalPriceSum = 0;
    let priceCount = 0;

    const byCategory: Record<string, { totalStock: number; totalValue: number; avgPrice: number }> = {};

    for (const product of products) {
      const { category, unitPrice, quantityInStock } = product;
      
      totalStock += quantityInStock;
      totalValue += quantityInStock * unitPrice;

      if (quantityInStock > 0) {
        totalPriceSum += unitPrice;
        priceCount += 1;
      }

      if (!byCategory[category]) {
        byCategory[category] = { totalStock: 0, totalValue: 0, avgPrice: 0 };
      }

      byCategory[category].totalStock += quantityInStock;
      byCategory[category].totalValue += quantityInStock * unitPrice;
    }

    
    const avgPrice = priceCount > 0 ? totalPriceSum / priceCount : 0;

    for (const category in byCategory) {
      const cat = byCategory[category];
      cat.avgPrice = cat.totalStock > 0 ? cat.totalValue / cat.totalStock : 0;
    }

    return { totalStock, totalValue, avgPrice, byCategory };
  }, [products]);

  return (
    <Paper elevation={3} sx={{ padding: 2, minWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Inventory Metrics
      </Typography>

      <Box mb={2}>
        <Typography>Total Stock: <strong>{metrics.totalStock}</strong></Typography>
        <Typography>Total Value: <strong>${metrics.totalValue.toFixed(2)}</strong></Typography>
        <Typography>Average Price: <strong>${metrics.avgPrice.toFixed(2)}</strong></Typography>
      </Box>

      <Divider sx={{ mb: 1 }} />
      <Typography variant="subtitle1" gutterBottom>
        By Category
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Category</strong></TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Avg Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(metrics.byCategory).map(([category, data]) => (
            <TableRow key={category}>
              <TableCell>{category}</TableCell>
              <TableCell align="right">{data.totalStock}</TableCell>
              <TableCell align="right">${data.totalValue.toFixed(2)}</TableCell>
              <TableCell align="right">${data.avgPrice.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default MetricsPanel;
