import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/apiService';

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  totalAmount: number;
  items: any[];
}

interface PurchaseOrdersState {
  purchaseOrders: PurchaseOrder[];
  currentPurchaseOrder: PurchaseOrder | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: PurchaseOrdersState = {
  purchaseOrders: [],
  currentPurchaseOrder: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchPurchaseOrders = createAsyncThunk(
  'purchaseOrders/fetchPurchaseOrders',
  async (params?: any) => {
    const response = await ApiService.getPurchaseOrders(params);
    return response;
  }
);

export const fetchPurchaseOrder = createAsyncThunk(
  'purchaseOrders/fetchPurchaseOrder',
  async (id: string) => {
    const response = await ApiService.getPurchaseOrder(id);
    return response;
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrders/createPurchaseOrder',
  async (orderData: Omit<PurchaseOrder, 'id'>) => {
    const response = await ApiService.createPurchaseOrder(orderData);
    return response;
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrders/updatePurchaseOrder',
  async ({ id, orderData }: { id: string; orderData: Partial<PurchaseOrder> }) => {
    const response = await ApiService.updatePurchaseOrder(id, orderData);
    return response;
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  'purchaseOrders/deletePurchaseOrder',
  async (id: string) => {
    await ApiService.deletePurchaseOrder(id);
    return id;
  }
);

const purchaseOrdersSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPurchaseOrder: (state) => {
      state.currentPurchaseOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload.purchaseOrders;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch purchase orders';
      })
      .addCase(fetchPurchaseOrder.fulfilled, (state, action) => {
        state.currentPurchaseOrder = action.payload;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders.push(action.payload);
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        const index = state.purchaseOrders.findIndex(po => po.id === action.payload.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
      })
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.purchaseOrders = state.purchaseOrders.filter(po => po.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentPurchaseOrder } = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;