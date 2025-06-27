import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';

const SalesOrders: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {GLOBAL_CONSTANTS.SALES_ORDERS.TITLE}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Sales Orders module coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This module will include full CRUD operations for sales orders with TanStack Query integration.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SalesOrders;