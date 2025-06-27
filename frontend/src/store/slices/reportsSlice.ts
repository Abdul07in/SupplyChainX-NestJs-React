import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/apiService';

interface ReportsState {
  inventoryReport: any;
  salesReport: any;
  purchaseReport: any;
  supplierPerformance: any;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  inventoryReport: null,
  salesReport: null,
  purchaseReport: null,
  supplierPerformance: null,
  loading: false,
  error: null,
};

export const fetchReport = createAsyncThunk(
  'reports/fetchReport',
  async ({ type, params }: { type: string; params?: any }) => {
    const response = await ApiService.getReports(type, params);
    return { type, data: response };
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        const { type, data } = action.payload;
        switch (type) {
          case 'inventory':
            state.inventoryReport = data;
            break;
          case 'sales':
            state.salesReport = data;
            break;
          case 'purchase':
            state.purchaseReport = data;
            break;
          case 'supplier-performance':
            state.supplierPerformance = data;
            break;
        }
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch report';
      });
  },
});

export const { clearError } = reportsSlice.actions;
export default reportsSlice.reducer;