import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';

const Shipments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {GLOBAL_CONSTANTS.SHIPMENTS.TITLE}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Shipments module coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This module will include shipment tracking, carrier management, and delivery status updates.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Shipments;