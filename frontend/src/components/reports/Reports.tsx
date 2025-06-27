import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';

const Reports: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {GLOBAL_CONSTANTS.REPORTS.TITLE}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Reports & Analytics module coming soon...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This module will include comprehensive reporting with charts, analytics, and data export capabilities.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Reports;