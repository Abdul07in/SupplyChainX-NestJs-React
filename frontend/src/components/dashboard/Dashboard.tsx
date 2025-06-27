import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  People,
  ShoppingCart,
  Warning,
} from '@mui/icons-material';
import { useDashboard } from '../../hooks/queries/useDashboard';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';
import LoadingFallback from '../common/LoadingFallback';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }}}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value.toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ color, fontSize: 48 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const { metrics, recentActivities, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return <LoadingFallback message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 2 }}
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {GLOBAL_CONSTANTS.DASHBOARD.TITLE}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {GLOBAL_CONSTANTS.DASHBOARD.OVERVIEW}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={GLOBAL_CONSTANTS.DASHBOARD.TOTAL_PRODUCTS}
            value={metrics?.totalProducts || 0}
            icon={<Inventory />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={GLOBAL_CONSTANTS.DASHBOARD.ACTIVE_SUPPLIERS}
            value={metrics?.activeSuppliers || 0}
            icon={<People />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={GLOBAL_CONSTANTS.DASHBOARD.PENDING_ORDERS}
            value={metrics?.pendingOrders || 0}
            icon={<ShoppingCart />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title={GLOBAL_CONSTANTS.DASHBOARD.LOW_STOCK_ITEMS}
            value={metrics?.lowStockItems || 0}
            icon={<Warning />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Inventory Overview
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '300px',
                color: 'text.secondary' 
              }}
            >
              <Typography variant="body1">
                Chart visualization would be implemented here
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              {GLOBAL_CONSTANTS.DASHBOARD.RECENT_ACTIVITIES}
            </Typography>
            <List dense sx={{ maxHeight: '300px', overflow: 'auto' }}>
              {recentActivities.map((activity: any) => (
                <ListItem key={activity.id} divider>
                  <ListItemText
                    primary={activity.text}
                    secondary={activity.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {GLOBAL_CONSTANTS.DASHBOARD.QUICK_ACTIONS}
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" startIcon={<Inventory />}>
              Add Product
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<ShoppingCart />}>
              Create Purchase Order
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" startIcon={<TrendingUp />}>
              View Reports
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;