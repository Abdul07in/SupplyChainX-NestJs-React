import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/apiService';

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  totalAmount: number;
  items: any[];
}

interface SalesOrdersState {
  salesOrders: SalesOrder[];
  currentSalesOrder: SalesOrder | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: SalesOrdersState = {
  salesOrders: [],
  currentSalesOrder: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchSalesOrders = createAsyncThunk(
  'salesOrders/fetchSalesOrders',
  async (params?: any) => {
    const response = await ApiService.getSalesOrders(params);
    return response;
  }
);

export const fetchSalesOrder = createAsyncThunk(
  'salesOrders/fetchSalesOrder',
  async (id: string) => {
    const response = await ApiService.getSalesOrder(id);
    return response;
  }
);

export const createSalesOrder = createAsyncThunk(
  'salesOrders/createSalesOrder',
  async (orderData: Omit<SalesOrder, 'id'>) => {
    const response = await ApiService.createSalesOrder(orderData);
    return response;
  }
);

export const updateSalesOrder = createAsyncThunk(
  'salesOrders/updateSalesOrder',
  async ({ id, orderData }: { id: string; orderData: Partial<SalesOrder> }) => {
    const response = await ApiService.updateSalesOrder(id, orderData);
    return response;
  }
);

export const deleteSalesOrder = createAsyncThunk(
  'salesOrders/deleteSalesOrder',
  async (id: string) => {
    await ApiService.deleteSalesOrder(id);
    return id;
  }
);

const salesOrdersSlice = createSlice({
  name: 'salesOrders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSalesOrder: (state) => {
      state.currentSalesOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.salesOrders = action.payload.salesOrders;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchSalesOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sales orders';
      })
      .addCase(fetchSalesOrder.fulfilled, (state, action) => {
        state.currentSalesOrder = action.payload;
      })
      .addCase(createSalesOrder.fulfilled, (state, action) => {
        state.salesOrders.push(action.payload);
      })
      .addCase(updateSalesOrder.fulfilled, (state, action) => {
        const index = state.salesOrders.findIndex(so => so.id === action.payload.id);
        if (index !== -1) {
          state.salesOrders[index] = action.payload;
        }
      })
      .addCase(deleteSalesOrder.fulfilled, (state, action) => {
        state.salesOrders = state.salesOrders.filter(so => so.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentSalesOrder } = salesOrdersSlice.actions;
export default salesOrdersSlice.reducer;