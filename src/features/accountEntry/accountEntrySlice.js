import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get application by id
export const fetchAccountEntryByAppId = createAsyncThunk(
  'account-entry/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get('/application/get-account-entry', { params: { id } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Account Entry fetch failed');
    }
  }
);

//Async thunk for save account-entry
export const saveAccountEntry = createAsyncThunk(
  'account-entry/save',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const response = await axios.post('/application/account-entry', { id, data });
      dispatch(fetchAccountEntryByAppId(id));
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Account Entry failed');
    }
  }
);

//Async thunk for save account-entry
export const saveReceiptEntry = createAsyncThunk(
  'account-entry/save-receipt',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const response = await axios.post('/application/receipt-entry', { id, data });
      dispatch(fetchAccountEntryByAppId(id));
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Receipt Entry failed');
    }
  }
);

const accountEntrySlice = createSlice({
  name: 'account-entry',
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
      .addCase(fetchAccountEntryByAppId.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
        state.data = {};
      })
      .addCase(fetchAccountEntryByAppId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || {};
      })
      .addCase(fetchAccountEntryByAppId.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      });
  },
});

export const { } = accountEntrySlice.actions;
export default accountEntrySlice.reducer;
