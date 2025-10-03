import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get application by id
export const fetchFeedbackByAppId = createAsyncThunk(
  'feedback/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get('/application/get-feedback', { params: { id } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Feedback fetch failed');
    }
  }
);

//Async thunk for save feedback
export const saveFeedback = createAsyncThunk(
  'feedback/save',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const response = await axios.post('/application/feedback-entry', { id, data });
      dispatch(fetchFeedbackByAppId(id));
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Feedback failed');
    }
  }
);

const FeedbackSlice = createSlice({
  name: 'feedback',
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
      .addCase(fetchFeedbackByAppId.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
        state.data = {};
      })
      .addCase(fetchFeedbackByAppId.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || {};
      })
      .addCase(fetchFeedbackByAppId.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      });
  },
});

export const { } = FeedbackSlice.actions;
export default FeedbackSlice.reducer;
