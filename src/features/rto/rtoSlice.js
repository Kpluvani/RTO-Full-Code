import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get rtos
export const fetchAllRtos = createAsyncThunk(
  'rto/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/rto', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Rtos Failed');
    }
  }
);

// Async thunk for get rtos
export const fetchRtos = createAsyncThunk(
  'rto/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/rto', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Rtos Failed');
    }
  }
);

// Async thunk for add rto
export const addRto = createAsyncThunk(
  'rto/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/rto', data);
      const { page, limit, search, searchCols, include, exclude } = getState().rto || {};
      dispatch(fetchRtos({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Rto added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Rto Failed');
    }
  }
);

// Async thunk for edit rto
export const editRto = createAsyncThunk(
  'rto/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/rto/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().rto || {};
      dispatch(fetchRtos({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Rto updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Rto Failed');
    }
  }
);

export const updateRtoStatus = createAsyncThunk(
  'rto/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/rto/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().rto || {};
      dispatch(fetchRtos({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete rto
export const deleteRto = createAsyncThunk(
  'rto/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/rto/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().rto || {};
      dispatch(fetchRtos({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Rto deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Rto Failed');
    }
  }
);

const rtoSlice = createSlice({
  name: 'rto',
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
    // fetch all data with pagination
      .addCase(fetchRtos.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRtos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchRtos.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllRtos.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRtos.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllRtos.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = rtoSlice.actions;
export default rtoSlice.reducer;
