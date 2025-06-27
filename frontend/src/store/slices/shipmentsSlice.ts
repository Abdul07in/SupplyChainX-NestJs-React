import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ApiService from '../../services/apiService';

interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  status: string;
  estimatedDelivery: string;
  orderId: string;
}

interface ShipmentsState {
  shipments: Shipment[];
  currentShipment: Shipment | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

const initialState: ShipmentsState = {
  shipments: [],
  currentShipment: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const fetchShipments = createAsyncThunk(
  'shipments/fetchShipments',
  async (params?: any) => {
    const response = await ApiService.getShipments(params);
    return response;
  }
);

export const fetchShipment = createAsyncThunk(
  'shipments/fetchShipment',
  async (id: string) => {
    const response = await ApiService.getShipment(id);
    return response;
  }
);

export const createShipment = createAsyncThunk(
  'shipments/createShipment',
  async (shipmentData: Omit<Shipment, 'id'>) => {
    const response = await ApiService.createShipment(shipmentData);
    return response;
  }
);

export const updateShipment = createAsyncThunk(
  'shipments/updateShipment',
  async ({ id, shipmentData }: { id: string; shipmentData: Partial<Shipment> }) => {
    const response = await ApiService.updateShipment(id, shipmentData);
    return response;
  }
);

export const deleteShipment = createAsyncThunk(
  'shipments/deleteShipment',
  async (id: string) => {
    await ApiService.deleteShipment(id);
    return id;
  }
);

const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload.shipments;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shipments';
      })
      .addCase(fetchShipment.fulfilled, (state, action) => {
        state.currentShipment = action.payload;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.shipments.push(action.payload);
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        const index = state.shipments.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.shipments = state.shipments.filter(s => s.id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentShipment } = shipmentsSlice.actions;
export default shipmentsSlice.reducer;