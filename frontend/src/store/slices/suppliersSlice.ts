import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/apiService';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

interface SuppliersState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: SuppliersState = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (params?: any) => {
    const response = await ApiService.getSuppliers(params);
    return response;
  }
);

export const fetchSupplier = createAsyncThunk(
  'suppliers/fetchSupplier',
  async (id: string) => {
    const response = await ApiService.getSupplier(id);
    return response;
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (supplierData: Omit<Supplier, 'id'>) => {
    const response = await ApiService.createSupplier(supplierData);
    return response;
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, supplierData }: { id: string; supplierData: Partial<Supplier> }) => {
    const response = await ApiService.updateSupplier(id, supplierData);
    return response;
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/deleteSupplier',
  async (id: string) => {
    await ApiService.deleteSupplier(id);
    return id;
  }
);

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload.suppliers;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch suppliers';
      })
      .addCase(fetchSupplier.fulfilled, (state, action) => {
        state.currentSupplier = action.payload;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentSupplier } = suppliersSlice.actions;
export default suppliersSlice.reducer;