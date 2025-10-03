import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get user actions
export const fetchUserActions = createAsyncThunk(
  'user-action/getByUser',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-action/get-by-user', { params: { user_id } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch User Actions Failed');
    }
  }
);

// Async thunk for save User actions
export const saveUserActions = createAsyncThunk(
  'user-action/save',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/user-action/save', data);
      
      const { user_id } = getState().userAction || {};
      dispatch(fetchUserActions(user_id));
      return fulfillWithValue(response?.data?.message || 'Save user actions successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save user actions Failed');
    }
  }
);

const userActionSlice = createSlice({
  name: 'user-action',
  initialState: {
    data: [],
    user_id: null,
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.user_id = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserActions.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload || [];
      })
      .addCase(fetchUserActions.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export const { setUserId } = userActionSlice.actions;
export default userActionSlice.reducer;
