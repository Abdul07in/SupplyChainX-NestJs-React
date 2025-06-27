import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import { queryKeys, invalidateQueries } from '../../lib/queryClient';
import { navigationHelpers } from '../../routes';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ApiService.login,
    onSuccess: (data) => {
      // Store token
      localStorage.setItem('authToken', data.token);
      
      // Update auth query cache
      queryClient.setQueryData(queryKeys.auth.user, data.user);
      
      // Navigate to dashboard
      navigate(navigationHelpers.goToDashboard());
      
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      console.error('Login failed:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: ApiService.logout,
    onSuccess: () => {
      // Clear token
      localStorage.removeItem('authToken');
      
      // Clear all query cache
      queryClient.clear();
      
      // Navigate to login
      navigate(navigationHelpers.goToLogin());
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('authToken');
      queryClient.clear();
      navigate(navigationHelpers.goToLogin());
    },
  });

  // Get current user query
  const userQuery = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No token found');
      
      // Mock user data - in real app, this would fetch from API
      return {
        id: '1',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'admin',
      };
    },
    enabled: !!localStorage.getItem('authToken'),
    staleTime: Infinity, // User data rarely changes
  });

  return {
    // Queries
    user: userQuery.data,
    isAuthenticated: !!localStorage.getItem('authToken') && !userQuery.isError,
    isLoadingUser: userQuery.isLoading,
    
    // Mutations
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    
    // Errors
    loginError: loginMutation.error?.message || null,
    userError: userQuery.error?.message || null,
  };
};