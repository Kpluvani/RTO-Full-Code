import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllMonth = createAsyncThunk(
  'month/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/month', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Month Failed');
    }
  }
);

// Async thunk for get Month
export const fetchMonth = createAsyncThunk(
  'month/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/month', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Month Failed');
    }
  }
);

// Async thunk for add Month
export const addMonth = createAsyncThunk(
  'month/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/month', data);
      const { page, limit, search, searchCols, include, exclude } = getState().month || {};
      dispatch(fetchMonth({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Month added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Month Failed');
    }
  }
);

// Async thunk for edit Month
export const editMonth = createAsyncThunk(
  'month/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/month/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().month || {};
      dispatch(fetchMonth({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Month updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Month Failed');
    }
  }
);

export const updateMonthStatus = createAsyncThunk(
  'month/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/month/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().month || {};
      dispatch(fetchMonth({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete month
export const deleteMonth = createAsyncThunk(
  'month/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/month/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().month || {};
      dispatch(fetchMonth({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Month deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Month Failed');
    }
  }
);

const monthSlice = createSlice({
  name: 'month',
  initialState: {
    allData: [],
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    months: [],
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
      .addCase(fetchMonth.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllMonth.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = monthSlice.actions;
export default monthSlice.reducer;
