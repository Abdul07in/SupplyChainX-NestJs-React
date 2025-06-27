import React, { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import ErrorFallback from '../components/common/ErrorFallback';
import LoadingFallback from '../components/common/LoadingFallback';

// Lazy-loaded components
const Login = lazy(() => import('../components/auth/Login'));
const Dashboard = lazy(() => import('../components/dashboard/Dashboard'));
const Products = lazy(() => import('../components/products/Products'));
const Suppliers = lazy(() => import('../components/suppliers/Suppliers'));
const PurchaseOrders = lazy(() => import('../components/purchase-orders/PurchaseOrders'));
const SalesOrders = lazy(() => import('../components/sales-orders/SalesOrders'));
const Warehouse = lazy(() => import('../components/warehouse/Warehouse'));
const Shipments = lazy(() => import('../components/shipments/Shipments'));
const Reports = lazy(() => import('../components/reports/Reports'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Route configuration
export const routeConfig = {
  auth: {
    login: '/login',
  },
  dashboard: {
    root: '/dashboard',
  },
  products: {
    root: '/products',
    detail: '/products/:id',
  },
  suppliers: {
    root: '/suppliers',
    detail: '/suppliers/:id',
  },
  purchaseOrders: {
    root: '/purchase-orders',
    detail: '/purchase-orders/:id',
  },
  salesOrders: {
    root: '/sales-orders',
    detail: '/sales-orders/:id',
  },
  warehouse: {
    root: '/warehouse',
    inventory: '/warehouse/inventory',
    movements: '/warehouse/movements',
  },
  shipments: {
    root: '/shipments',
    detail: '/shipments/:id',
  },
  reports: {
    root: '/reports',
    inventory: '/reports/inventory',
    sales: '/reports/sales',
    purchase: '/reports/purchase',
    supplier: '/reports/supplier-performance',
  },
} as const;

// Route component wrapper with error boundary
const RouteWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, errorInfo) => {
      console.error('Route Error:', error, errorInfo);
    }}
  >
    <React.Suspense fallback={<LoadingFallback />}>{children}</React.Suspense>
  </ErrorBoundary>
);

// Create router configuration
export const router = createBrowserRouter([
  {
    path: routeConfig.auth.login,
    element: (
      <RouteWrapper>
        <Login />
      </RouteWrapper>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={routeConfig.dashboard.root} replace />,
      },
      {
        path: routeConfig.dashboard.root,
        element: (
          <RouteWrapper>
            <Dashboard />
          </RouteWrapper>
        ),
      },
      {
        path: routeConfig.products.root,
        element: (
          <RouteWrapper>
            <Products />
          </RouteWrapper>
        ),
      },
      {
        path: routeConfig.suppliers.root,
        element: (
          <RouteWrapper>
            <Suppliers />
          </RouteWrapper>
        ),
      },
      {
        path: routeConfig.purchaseOrders.root,
        element: (
          <RouteWrapper>
            <PurchaseOrders />
          </RouteWrapper>
        ),
      },
      {
        path: routeConfig.salesOrders.root,
        element: (
          <RouteWrapper>
            <SalesOrders />
          </RouteWrapper>
        ),
      },
      {
        path: routeConfig.warehouse.root,
        element: (
          <RouteWrapper>
            <Warehouse />
          </RouteWrapper>
        ),
      },
      {
        path: routeConfig.shipments.root,
        element: (
          <RouteWrapper>
            <Shipments />
          </RouteWrapper>
        ),
      },
      {
        path: routeConfig.reports.root,
        element: (
          <RouteWrapper>
            <Reports />
          </RouteWrapper>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <RouteWrapper>
        <NotFound />
      </RouteWrapper>
    ),
  },
]);

// Navigation helpers
export const navigationHelpers = {
  goToLogin: () => routeConfig.auth.login,
  goToDashboard: () => routeConfig.dashboard.root,
  goToProducts: () => routeConfig.products.root,
  goToProductDetail: (id: string) =>
    routeConfig.products.detail.replace(':id', id),
  goToSuppliers: () => routeConfig.suppliers.root,
  goToSupplierDetail: (id: string) =>
    routeConfig.suppliers.detail.replace(':id', id),
  goToPurchaseOrders: () => routeConfig.purchaseOrders.root,
  goToPurchaseOrderDetail: (id: string) =>
    routeConfig.purchaseOrders.detail.replace(':id', id),
  goToSalesOrders: () => routeConfig.salesOrders.root,
  goToSalesOrderDetail: (id: string) =>
    routeConfig.salesOrders.detail.replace(':id', id),
  goToWarehouse: () => routeConfig.warehouse.root,
  goToShipments: () => routeConfig.shipments.root,
  goToShipmentDetail: (id: string) =>
    routeConfig.shipments.detail.replace(':id', id),
  goToReports: () => routeConfig.reports.root,
};
