import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';
import { all } from 'axios';


export const fetchAllBrokers = createAsyncThunk(
  'broker/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/broker', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch broker Failed');
    }
  }
);

// Async thunk for get brokers
export const fetchBrokers = createAsyncThunk(
  'broker/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/broker', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Brokers Failed');
    }
  }
);

// Async thunk for add broker
export const addBroker = createAsyncThunk(
  'broker/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/broker', data);
      const { page, limit, search, searchCols, include, exclude } = getState().broker || {};
      dispatch(fetchBrokers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Broker added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Broker Failed');
    }
  }
);

// Async thunk for edit broker
export const editBroker = createAsyncThunk(
  'broker/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/broker/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().broker || {};
      dispatch(fetchBrokers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Broker updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Broker Failed');
    }
  }
);

export const updateBrokerStatus = createAsyncThunk(
  'broker/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/broker/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().broker || {};
      dispatch(fetchBrokers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete broker
export const deleteBroker = createAsyncThunk(
  'broker/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/broker/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().broker || {};
      dispatch(fetchBrokers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Broker deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Broker Failed');
    }
  }
);

const brokerSlice = createSlice({
  name: 'broker',
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
      .addCase(fetchBrokers.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrokers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchBrokers.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllBrokers.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBrokers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllBrokers.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = brokerSlice.actions;
export default brokerSlice.reducer;
