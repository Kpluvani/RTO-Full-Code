import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllHoldReasons = createAsyncThunk(
  'hold-reasons/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/hold-reasons', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch All Hold Reasons Failed');
    }
  }
);

// Async thunk for get HoldReason
export const fetchHoldReason = createAsyncThunk(
  'hold-reasons/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/hold-reasons', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Hold Reasons Failed');
    }
  }
);

// Async thunk for add HoldReason
export const addHoldReason = createAsyncThunk(
  'hold-reasons/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/hold-reasons', data);
      const { page, limit, search, searchCols, include, exclude } = getState().holdReason || {};
      dispatch(fetchHoldReason({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Hold Reason added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Hold Reason Failed');
    }
  }
);

// Async thunk for edit Hold Reason
export const editHoldReason = createAsyncThunk(
  'hold-reasons/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/hold-reasons/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().holdReason || {};
      dispatch(fetchHoldReason({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Hold Reason updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Hold Reason Failed');
    }
  }
);

export const updateHoldReasonStatus = createAsyncThunk(
  'hold-reasons/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/hold-reasons/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().holdReason || {};
      dispatch(fetchHoldReason({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete hold reasons
export const deleteHoldReason = createAsyncThunk(
  'hold-reasons/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/hold-reasons/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().holdReason || {};
      dispatch(fetchHoldReason({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Hold Reason deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Hold Reason Failed');
    }
  }
);


const HoldReasonSlice = createSlice({
  name: 'HoldReason',
  initialState: {
    allData: [],
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    search: "",
    searchCols: "name",
    include: "",
    exclude: "is_delete",
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSearchCols: (state, action) => {
      state.searchCols = action.payload;
    },
    setInclude: (state, action) => {
      state.include = action.payload;
    },
    setExclude: (state, action) => {
      state.exclude = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldReason.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoldReason.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchHoldReason.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllHoldReasons.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllHoldReasons.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllHoldReasons.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = HoldReasonSlice.actions;
export default HoldReasonSlice.reducer;
