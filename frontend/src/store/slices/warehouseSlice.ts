import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/apiService';

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  location: string;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  date: string;
  notes?: string;
}

interface WarehouseState {
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  loading: boolean;
  error: string | null;
}

const initialState: WarehouseState = {
  inventory: [],
  stockMovements: [],
  loading: false,
  error: null,
};

export const fetchInventory = createAsyncThunk(
  'warehouse/fetchInventory',
  async (params?: any) => {
    const response = await ApiService.getInventory(params);
    return response;
  }
);

export const fetchStockMovements = createAsyncThunk(
  'warehouse/fetchStockMovements',
  async (params?: any) => {
    const response = await ApiService.getStockMovements(params);
    return response;
  }
);

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload.inventory;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch inventory';
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.stockMovements = action.payload.movements;
      });
  },
});

export const { clearError } = warehouseSlice.actions;
export default warehouseSlice.reducer;