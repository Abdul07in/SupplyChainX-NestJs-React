import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/apiService';
import { queryKeys, invalidateQueries } from '../../lib/queryClient';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

export const useSuppliers = (filters?: any) => {
  const queryClient = useQueryClient();

  // Fetch suppliers query
  const suppliersQuery = useQuery({
    queryKey: queryKeys.suppliers.list(filters),
    queryFn: () => ApiService.getSuppliers(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    // Mock data fallback
    placeholderData: {
      suppliers: [
        {
          id: '1',
          name: 'Tech Corp Solutions',
          contactPerson: 'John Smith',
          email: 'john@techcorp.com',
          phone: '+1-555-0123',
          address: '123 Tech Street, Silicon Valley, CA 94000',
          status: 'Active'
        },
        {
          id: '2',
          name: 'Furniture Plus Ltd',
          contactPerson: 'Sarah Johnson',
          email: 'sarah@furnitureplus.com',
          phone: '+1-555-0456',
          address: '456 Furniture Ave, Dallas, TX 75001',
          status: 'Active'
        },
        {
          id: '3',
          name: 'Eco Products Inc',
          contactPerson: 'Mike Wilson',
          email: 'mike@ecoproducts.com',
          phone: '+1-555-0789',
          address: '789 Green Way, Portland, OR 97001',
          status: 'Inactive'
        },
      ],
      totalCount: 3,
    },
  });

  // Create supplier mutation
  const createSupplierMutation = useMutation({
    mutationFn: ApiService.createSupplier,
    onSuccess: (newSupplier) => {
      queryClient.setQueryData(
        queryKeys.suppliers.list(filters),
        (old: any) => ({
          ...old,
          suppliers: [...(old?.suppliers || []), newSupplier],
          totalCount: (old?.totalCount || 0) + 1,
        })
      );
      
      invalidateQueries.suppliers();
      invalidateQueries.dashboard();
    },
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: ({ id, supplierData }: { id: string; supplierData: Partial<Supplier> }) =>
      ApiService.updateSupplier(id, supplierData),
    onMutate: async ({ id, supplierData }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.suppliers.all });

      const previousSuppliers = queryClient.getQueryData(queryKeys.suppliers.list(filters));

      queryClient.setQueryData(
        queryKeys.suppliers.list(filters),
        (old: any) => ({
          ...old,
          suppliers: old?.suppliers?.map((supplier: Supplier) =>
            supplier.id === id ? { ...supplier, ...supplierData } : supplier
          ) || [],
        })
      );

      return { previousSuppliers };
    },
    onError: (err, variables, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(queryKeys.suppliers.list(filters), context.previousSuppliers);
      }
    },
    onSettled: () => {
      invalidateQueries.suppliers();
    },
  });

  // Delete supplier mutation
  const deleteSupplierMutation = useMutation({
    mutationFn: ApiService.deleteSupplier,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.suppliers.all });

      const previousSuppliers = queryClient.getQueryData(queryKeys.suppliers.list(filters));

      queryClient.setQueryData(
        queryKeys.suppliers.list(filters),
        (old: any) => ({
          ...old,
          suppliers: old?.suppliers?.filter((supplier: Supplier) => supplier.id !== id) || [],
          totalCount: Math.max((old?.totalCount || 1) - 1, 0),
        })
      );

      return { previousSuppliers };
    },
    onError: (err, variables, context) => {
      if (context?.previousSuppliers) {
        queryClient.setQueryData(queryKeys.suppliers.list(filters), context.previousSuppliers);
      }
    },
    onSettled: () => {
      invalidateQueries.suppliers();
      invalidateQueries.dashboard();
    },
  });

  return {
    // Data
    suppliers: suppliersQuery.data?.suppliers || [],
    totalCount: suppliersQuery.data?.totalCount || 0,
    
    // Loading states
    isLoading: suppliersQuery.isLoading,
    isCreating: createSupplierMutation.isPending,
    isUpdating: updateSupplierMutation.isPending,
    isDeleting: deleteSupplierMutation.isPending,
    
    // Error states
    error: suppliersQuery.error?.message || null,
    createError: createSupplierMutation.error?.message || null,
    updateError: updateSupplierMutation.error?.message || null,
    deleteError: deleteSupplierMutation.error?.message || null,
    
    // Actions
    createSupplier: createSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deleteSupplier: deleteSupplierMutation.mutate,
    refetch: suppliersQuery.refetch,
  };
};

export const useSupplier = (id: string) => {
  const supplierQuery = useQuery({
    queryKey: queryKeys.suppliers.detail(id),
    queryFn: () => ApiService.getSupplier(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    supplier: supplierQuery.data,
    isLoading: supplierQuery.isLoading,
    error: supplierQuery.error?.message || null,
    refetch: supplierQuery.refetch,
  };
};