import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LoadingFallbackProps } from '../../interfaces/common/LoadingFallbackProps';

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant='body1' color='text.secondary'>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingFallback;
