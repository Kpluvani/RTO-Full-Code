import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get states
export const fetchAllStates = createAsyncThunk(
  'state/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/state', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch States Failed');
    }
  }
);

// Async thunk for get states
export const fetchStates = createAsyncThunk(
  'state/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/state', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch States Failed');
    }
  }
);

// Async thunk for add state
export const addState = createAsyncThunk(
  'state/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/state', data);
      const { page, limit, search, searchCols, include, exclude } = getState().state || {};
      dispatch(fetchStates({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'State added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add State Failed');
    }
  }
);

// Async thunk for edit state
export const editState = createAsyncThunk(
  'state/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/state/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().state || {};
      dispatch(fetchStates({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'State updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update State Failed');
    }
  }
);

export const updateStateStatus = createAsyncThunk(
  'state/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/state/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().state || {};
      dispatch(fetchStates({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete state
export const deleteState = createAsyncThunk(
  'state/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/state/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().state || {};
      dispatch(fetchStates({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'State deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete State Failed');
    }
  }
);

const stateSlice = createSlice({
  name: 'state',
  initialState: {
    allData: [],
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    search: "",
    searchCols: "name,state_code",
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
    // fetch all data with pagination
      .addCase(fetchStates.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllStates.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStates.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllStates.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = stateSlice.actions;
export default stateSlice.reducer;
