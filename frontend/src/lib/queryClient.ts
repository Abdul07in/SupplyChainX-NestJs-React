import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests 3 times with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Background refetch interval: 5 minutes
      refetchInterval: 5 * 60 * 1000,
      // Only refetch in background if data is stale
      refetchIntervalInBackground: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
  },
  // Dashboard
  dashboard: {
    overview: ['dashboard', 'overview'] as const,
    metrics: ['dashboard', 'metrics'] as const,
    activities: ['dashboard', 'activities'] as const,
  },
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  // Suppliers
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => [...queryKeys.suppliers.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.suppliers.lists(), { filters }] as const,
    details: () => [...queryKeys.suppliers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.suppliers.details(), id] as const,
  },
  // Purchase Orders
  purchaseOrders: {
    all: ['purchase-orders'] as const,
    lists: () => [...queryKeys.purchaseOrders.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.purchaseOrders.lists(), { filters }] as const,
    details: () => [...queryKeys.purchaseOrders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.purchaseOrders.details(), id] as const,
  },
  // Sales Orders
  salesOrders: {
    all: ['sales-orders'] as const,
    lists: () => [...queryKeys.salesOrders.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.salesOrders.lists(), { filters }] as const,
    details: () => [...queryKeys.salesOrders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.salesOrders.details(), id] as const,
  },
  // Warehouse
  warehouse: {
    all: ['warehouse'] as const,
    inventory: () => [...queryKeys.warehouse.all, 'inventory'] as const,
    movements: () => [...queryKeys.warehouse.all, 'movements'] as const,
  },
  // Shipments
  shipments: {
    all: ['shipments'] as const,
    lists: () => [...queryKeys.shipments.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.shipments.lists(), { filters }] as const,
    details: () => [...queryKeys.shipments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.shipments.details(), id] as const,
  },
  // Reports
  reports: {
    all: ['reports'] as const,
    type: (type: string) => [...queryKeys.reports.all, type] as const,
  },
} as const;

// Utility function to invalidate related queries
export const invalidateQueries = {
  dashboard: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview }),
  products: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  suppliers: () => queryClient.invalidateQueries({ queryKey: queryKeys.suppliers.all }),
  purchaseOrders: () => queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders.all }),
  salesOrders: () => queryClient.invalidateQueries({ queryKey: queryKeys.salesOrders.all }),
  warehouse: () => queryClient.invalidateQueries({ queryKey: queryKeys.warehouse.all }),
  shipments: () => queryClient.invalidateQueries({ queryKey: queryKeys.shipments.all }),
  reports: () => queryClient.invalidateQueries({ queryKey: queryKeys.reports.all }),
};