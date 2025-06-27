import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Base API configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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
export class ApiService {
  // Authentication
  static async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  static async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  // Dashboard
  static async getDashboardOverview() {
    const response = await apiClient.get('/reporting/overview');
    return response.data;
  }

  // Products
  static async getProducts(params?: any) {
    const response = await apiClient.get('/products', { params });
    return response.data;
  }

  static async getProduct(id: string) {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  }

  static async createProduct(productData: any) {
    const response = await apiClient.post('/products', productData);
    return response.data;
  }

  static async updateProduct(id: string, productData: any) {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  }

  static async deleteProduct(id: string) {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  }

  // Suppliers
  static async getSuppliers(params?: any) {
    const response = await apiClient.get('/suppliers', { params });
    return response.data;
  }

  static async getSupplier(id: string) {
    const response = await apiClient.get(`/suppliers/${id}`);
    return response.data;
  }

  static async createSupplier(supplierData: any) {
    const response = await apiClient.post('/suppliers', supplierData);
    return response.data;
  }

  static async updateSupplier(id: string, supplierData: any) {
    const response = await apiClient.put(`/suppliers/${id}`, supplierData);
    return response.data;
  }

  static async deleteSupplier(id: string) {
    const response = await apiClient.delete(`/suppliers/${id}`);
    return response.data;
  }

  // Purchase Orders
  static async getPurchaseOrders(params?: any) {
    const response = await apiClient.get('/purchase-orders', { params });
    return response.data;
  }

  static async getPurchaseOrder(id: string) {
    const response = await apiClient.get(`/purchase-orders/${id}`);
    return response.data;
  }

  static async createPurchaseOrder(orderData: any) {
    const response = await apiClient.post('/purchase-orders', orderData);
    return response.data;
  }

  static async updatePurchaseOrder(id: string, orderData: any) {
    const response = await apiClient.put(`/purchase-orders/${id}`, orderData);
    return response.data;
  }

  static async deletePurchaseOrder(id: string) {
    const response = await apiClient.delete(`/purchase-orders/${id}`);
    return response.data;
  }

  // Sales Orders
  static async getSalesOrders(params?: any) {
    const response = await apiClient.get('/sales-orders', { params });
    return response.data;
  }

  static async getSalesOrder(id: string) {
    const response = await apiClient.get(`/sales-orders/${id}`);
    return response.data;
  }

  static async createSalesOrder(orderData: any) {
    const response = await apiClient.post('/sales-orders', orderData);
    return response.data;
  }

  static async updateSalesOrder(id: string, orderData: any) {
    const response = await apiClient.put(`/sales-orders/${id}`, orderData);
    return response.data;
  }

  static async deleteSalesOrder(id: string) {
    const response = await apiClient.delete(`/sales-orders/${id}`);
    return response.data;
  }

  // Warehouse
  static async getInventory(params?: any) {
    const response = await apiClient.get('/warehouse/inventory', { params });
    return response.data;
  }

  static async getStockMovements(params?: any) {
    const response = await apiClient.get('/warehouse/movements', { params });
    return response.data;
  }

  // Shipments
  static async getShipments(params?: any) {
    const response = await apiClient.get('/shipments', { params });
    return response.data;
  }

  static async getShipment(id: string) {
    const response = await apiClient.get(`/shipments/${id}`);
    return response.data;
  }

  static async createShipment(shipmentData: any) {
    const response = await apiClient.post('/shipments', shipmentData);
    return response.data;
  }

  static async updateShipment(id: string, shipmentData: any) {
    const response = await apiClient.put(`/shipments/${id}`, shipmentData);
    return response.data;
  }

  static async deleteShipment(id: string) {
    const response = await apiClient.delete(`/shipments/${id}`);
    return response.data;
  }

  // Reports
  static async getReports(type: string, params?: any) {
    const response = await apiClient.get(`/reports/${type}`, { params });
    return response.data;
  }
}

export default ApiService;