import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';
import productsSlice from './slices/productsSlice';
import suppliersSlice from './slices/suppliersSlice';
import purchaseOrdersSlice from './slices/purchaseOrdersSlice';
import salesOrdersSlice from './slices/salesOrdersSlice';
import warehouseSlice from './slices/warehouseSlice';
import shipmentsSlice from './slices/shipmentsSlice';
import reportsSlice from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    products: productsSlice,
    suppliers: suppliersSlice,
    purchaseOrders: purchaseOrdersSlice,
    salesOrders: salesOrdersSlice,
    warehouse: warehouseSlice,
    shipments: shipmentsSlice,
    reports: reportsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;