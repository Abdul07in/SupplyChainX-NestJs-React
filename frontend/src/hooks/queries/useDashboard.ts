import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/apiService';
import { queryKeys } from '../../lib/queryClient';

export const useDashboard = () => {
  const overviewQuery = useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: ApiService.getDashboardOverview,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
    // Mock data fallback for demo
    placeholderData: {
      metrics: {
        totalProducts: 1250,
        activeSuppliers: 45,
        pendingOrders: 23,
        lowStockItems: 8,
      },
      recentActivities: [
        { id: 1, text: 'New purchase order #PO-2024-001 created', time: '2 hours ago' },
        { id: 2, text: 'Stock level updated for Product SKU-12345', time: '4 hours ago' },
        { id: 3, text: 'Supplier "ABC Corp" information updated', time: '6 hours ago' },
        { id: 4, text: 'Sales order #SO-2024-015 shipped', time: '8 hours ago' },
        { id: 5, text: 'Low stock alert for Widget XYZ', time: '1 day ago' },
      ],
    },
  });

  return {
    metrics: overviewQuery.data?.metrics,
    recentActivities: overviewQuery.data?.recentActivities || [],
    isLoading: overviewQuery.isLoading,
    error: overviewQuery.error?.message || null,
    refetch: overviewQuery.refetch,
  };
};