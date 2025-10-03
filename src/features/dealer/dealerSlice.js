import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';
import { all } from 'axios';

export const fetchAllDealer = createAsyncThunk(
  'dealer/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/dealer', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Dealer Failed');
    }
  }
);

// Async thunk for get dealers
export const fetchDealers = createAsyncThunk(
  'dealer/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/dealer', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Dealers Failed');
    }
  }
);

// Async thunk for add dealer
export const addDealer = createAsyncThunk(
  'dealer/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/dealer', data);
      const { page, limit, search, searchCols, include, exclude } = getState().dealer || {};
      dispatch(fetchDealers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Dealer added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Dealer Failed');
    }
  }
);

// Async thunk for edit dealer
export const editDealer = createAsyncThunk(
  'dealer/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/dealer/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().dealer || {};
      dispatch(fetchDealers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Dealer updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Dealer Failed');
    }
  }
);

export const updateDealerStatus = createAsyncThunk(
  'dealer/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/dealer/status/${id}`, { status });
      // Optionally refetch dealers
      const { page, limit, search, searchCols, include, exclude } = getState().dealer || {};
      dispatch(fetchDealers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete dealer
export const deleteDealer = createAsyncThunk(
  'dealer/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/dealer/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().dealer || {};
      dispatch(fetchDealers({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Dealer deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Dealer Failed');
    }
  }
);

const dealerSlice = createSlice({
  name: 'dealer',
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
      .addCase(fetchDealers.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchDealers.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllDealer.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDealer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllDealer.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = dealerSlice.actions;
export default dealerSlice.reducer;
