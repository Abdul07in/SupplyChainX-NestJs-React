import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/apiService';
import { queryKeys, invalidateQueries } from '../../lib/queryClient';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
  supplier?: string;
}

export const useProducts = (filters?: any) => {
  const queryClient = useQueryClient();

  // Fetch products query
  const productsQuery = useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => ApiService.getProducts(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes
    // Mock data fallback
    placeholderData: {
      products: [
        {
          id: '1',
          name: 'Wireless Bluetooth Headphones',
          sku: 'WBH-001',
          category: 'Electronics',
          price: 99.99,
          stockQuantity: 150,
          description: 'High-quality wireless headphones with noise cancellation',
          supplier: 'Tech Corp'
        },
        {
          id: '2',
          name: 'Ergonomic Office Chair',
          sku: 'EOC-002',
          category: 'Furniture',
          price: 299.99,
          stockQuantity: 25,
          description: 'Comfortable office chair with lumbar support',
          supplier: 'Furniture Plus'
        },
        {
          id: '3',
          name: 'Stainless Steel Water Bottle',
          sku: 'SWB-003',
          category: 'Accessories',
          price: 24.99,
          stockQuantity: 8,
          description: 'Insulated water bottle keeps drinks cold/hot',
          supplier: 'Eco Products'
        },
      ],
      totalCount: 3,
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: ApiService.createProduct,
    onSuccess: (newProduct) => {
      // Optimistic update
      queryClient.setQueryData(
        queryKeys.products.list(filters),
        (old: any) => ({
          ...old,
          products: [...(old?.products || []), newProduct],
          totalCount: (old?.totalCount || 0) + 1,
        })
      );
      
      // Invalidate related queries
      invalidateQueries.products();
      invalidateQueries.dashboard();
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, productData }: { id: string; productData: Partial<Product> }) =>
      ApiService.updateProduct(id, productData),
    onMutate: async ({ id, productData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(queryKeys.products.list(filters));

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.products.list(filters),
        (old: any) => ({
          ...old,
          products: old?.products?.map((product: Product) =>
            product.id === id ? { ...product, ...productData } : product
          ) || [],
        })
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.list(filters), context.previousProducts);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      invalidateQueries.products();
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: ApiService.deleteProduct,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previousProducts = queryClient.getQueryData(queryKeys.products.list(filters));

      // Optimistically remove
      queryClient.setQueryData(
        queryKeys.products.list(filters),
        (old: any) => ({
          ...old,
          products: old?.products?.filter((product: Product) => product.id !== id) || [],
          totalCount: Math.max((old?.totalCount || 1) - 1, 0),
        })
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKeys.products.list(filters), context.previousProducts);
      }
    },
    onSettled: () => {
      invalidateQueries.products();
      invalidateQueries.dashboard();
    },
  });

  return {
    // Data
    products: productsQuery.data?.products || [],
    totalCount: productsQuery.data?.totalCount || 0,
    
    // Loading states
    isLoading: productsQuery.isLoading,
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    
    // Error states
    error: productsQuery.error?.message || null,
    createError: createProductMutation.error?.message || null,
    updateError: updateProductMutation.error?.message || null,
    deleteError: deleteProductMutation.error?.message || null,
    
    // Actions
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    refetch: productsQuery.refetch,
  };
};

export const useProduct = (id: string) => {
  const productQuery = useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => ApiService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    product: productQuery.data,
    isLoading: productQuery.isLoading,
    error: productQuery.error?.message || null,
    refetch: productQuery.refetch,
  };
};