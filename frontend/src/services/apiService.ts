import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Base API configuration
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Methods
const ApiService = {
  // Authentication
  login: async (credentials: { email: string; password: string }) => {
    // MOCK: Remove/comment this block when backend is ready
    await new Promise((res) => setTimeout(res, 500)); // Simulate network delay
    if (
      credentials.email === 'user@example.com' &&
      credentials.password === 'password'
    ) {
      return {
        token: 'mocked-jwt-token',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          role: 'admin',
        },
      };
    }
    throw new Error('Invalid credentials');

    // REAL: Uncomment this when backend is ready
    // const response = await apiClient.post('/auth/login', credentials);
    // return response.data;
  },

  logout: async () => {
    // MOCK: Remove/comment this block when backend is ready
    await new Promise((res) => setTimeout(res, 300)); // Simulate network delay
    return { success: true };

    // REAL: Uncomment this when backend is ready
    // const response = await apiClient.post('/auth/logout');
    // return response.data;
  },

  // Dashboard
  async getDashboardOverview() {
    const response = await apiClient.get('/reporting/overview');
    return response.data;
  },

  // Products
  async getProducts(params?: any) {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  async getProduct(id: string) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(productData: any) {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  async updateProduct(id: string, productData: any) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  // Suppliers
  async getSuppliers(params?: any) {
    const response = await apiClient.get('/suppliers', { params });
    return response.data;
  },

  async getSupplier(id: string) {
    const response = await apiClient.get(`/suppliers/${id}`);
    return response.data;
  },

  async createSupplier(supplierData: any) {
    const response = await apiClient.post('/suppliers', supplierData);
    return response.data;
  },

  async updateSupplier(id: string, supplierData: any) {
    const response = await apiClient.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },

  async deleteSupplier(id: string) {
    const response = await apiClient.delete(`/suppliers/${id}`);
    return response.data;
  },

  // Purchase Orders
  async getPurchaseOrders(params?: any) {
    const response = await apiClient.get('/purchase-orders', { params });
    return response.data;
  },

  async getPurchaseOrder(id: string) {
    const response = await apiClient.get(`/purchase-orders/${id}`);
    return response.data;
  },

  async createPurchaseOrder(orderData: any) {
    const response = await apiClient.post('/purchase-orders', orderData);
    return response.data;
  },

  async updatePurchaseOrder(id: string, orderData: any) {
    const response = await apiClient.put(`/purchase-orders/${id}`, orderData);
    return response.data;
  },

  async deletePurchaseOrder(id: string) {
    const response = await apiClient.delete(`/purchase-orders/${id}`);
    return response.data;
  },

  // Sales Orders
  async getSalesOrders(params?: any) {
    const response = await apiClient.get('/sales-orders', { params });
    return response.data;
  },

  async getSalesOrder(id: string) {
    const response = await apiClient.get(`/sales-orders/${id}`);
    return response.data;
  },

  async createSalesOrder(orderData: any) {
    const response = await apiClient.post('/sales-orders', orderData);
    return response.data;
  },

  async updateSalesOrder(id: string, orderData: any) {
    const response = await apiClient.put(`/sales-orders/${id}`, orderData);
    return response.data;
  },

  async deleteSalesOrder(id: string) {
    const response = await apiClient.delete(`/sales-orders/${id}`);
    return response.data;
  },

  // Warehouse
  async getInventory(params?: any) {
    const response = await apiClient.get('/warehouse/inventory', { params });
    return response.data;
  },

  async getStockMovements(params?: any) {
    const response = await apiClient.get('/warehouse/movements', { params });
    return response.data;
  },

  // Shipments
  async getShipments(params?: any) {
    const response = await apiClient.get('/shipments', { params });
    return response.data;
  },

  async getShipment(id: string) {
    const response = await apiClient.get(`/shipments/${id}`);
    return response.data;
  },

  async createShipment(shipmentData: any) {
    const response = await apiClient.post('/shipments', shipmentData);
    return response.data;
  },

  async updateShipment(id: string, shipmentData: any) {
    const response = await apiClient.put(`/shipments/${id}`, shipmentData);
    return response.data;
  },

  async deleteShipment(id: string) {
    const response = await apiClient.delete(`/shipments/${id}`);
    return response.data;
  },

  // Reports
  async getReports(type: string, params?: any) {
    const response = await apiClient.get(`/reports/${type}`, { params });
    return response.data;
  },
};

export default ApiService;
