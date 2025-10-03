import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const getBulkReceiptsByCategory = createAsyncThunk(
  'bulk-receipt/getBulkReceipt',
  async ({ id, searchBy }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/application/get-bulk-receipts-by-category', { params: { id, searchBy } });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//Async thunk for save account-entry
export const saveBulkReceiptEntry = createAsyncThunk(
  'bulk-receipt/saveBulkReceipt',
  async ({ id, searchBy, receipts }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const response = await axios.post('/application/save-bulk-receipt', { id, searchBy, receipts });
      dispatch(getBulkReceiptsByCategory({ id, searchBy }));
      return fulfillWithValue(response?.data?.message);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Bulk Receipt failed');
    }
  }
);

const bulkReceiptSlice = createSlice({
  name: 'bulk-receipt',
  initialState: {
    data: {},
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    // setApplicationId: (state, action) => {
    //   state.application_id = action.payload;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBulkReceiptsByCategory.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
        state.data = {};
      })
      .addCase(getBulkReceiptsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || {};
      })
      .addCase(getBulkReceiptsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      });
  },
});

export const { } = bulkReceiptSlice.actions;
export default bulkReceiptSlice.reducer;
