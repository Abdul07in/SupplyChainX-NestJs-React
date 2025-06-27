import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { Refresh, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FallbackProps } from 'react-error-boundary';
import { navigationHelpers } from '../../routes';

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(navigationHelpers.goToDashboard());
    resetErrorBoundary();
  };

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error?.message || 'An unexpected error occurred'}
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleGoHome}
          >
            Go to Dashboard
          </Button>
        </Box>

        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 3, textAlign: 'left' }}>
            <Typography variant="caption" color="text.secondary">
              Error Details (Development):
            </Typography>
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: 'grey.100',
                borderRadius: 1,
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              {error?.stack}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ErrorFallback;