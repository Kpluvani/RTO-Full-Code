import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllFinancer = createAsyncThunk(
  'financer/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/financer', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Financer Failed');
    }
  }
);

// Async thunk for get Financer
export const fetchFinancer = createAsyncThunk(
  'financer/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/financer', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Financer Failed');
    }
  }
);

// Async thunk for add Financer
export const addFinancer = createAsyncThunk(
  'financer/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/financer', data);
      const { page, limit, search, searchCols, include, exclude } = getState().financer || {};
      dispatch(fetchFinancer({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Financer added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Financer Failed');
    }
  }
);

// Async thunk for edit Financer
export const editFinancer = createAsyncThunk(
  'financer/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/financer/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().financer || {};
      dispatch(fetchFinancer({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Financer updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Financer Failed');
    }
  }
);

export const updateFinancerStatus = createAsyncThunk(
  'financer/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/financer/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().financer || {};
      dispatch(fetchFinancer({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete financer
export const deleteFinancer = createAsyncThunk(
  'financer/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/financer/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().financer || {};
      dispatch(fetchFinancer({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Financer deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Financer Failed');
    }
  }
);

const financerSlice = createSlice({
  name: 'financer',
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
      .addCase(fetchFinancer.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinancer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchFinancer.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllFinancer.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFinancer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllFinancer.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = financerSlice.actions;
export default financerSlice.reducer;
