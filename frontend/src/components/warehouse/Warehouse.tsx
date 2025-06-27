import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';

const Warehouse: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {GLOBAL_CONSTANTS.WAREHOUSE.TITLE}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Warehouse Management module coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This module will include inventory tracking, stock movements, and warehouse operations.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Warehouse;