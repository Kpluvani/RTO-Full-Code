import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get process w/o pagination
export const fetchAllProcess = createAsyncThunk(
  'process/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/process', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Process Failed');
    }
  }
);

// Async thunk for get process
export const fetchProcess = createAsyncThunk(
  'process/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/process', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Process Failed');
    }
  }
);

// Async thunk for add process
export const addProcess = createAsyncThunk(
  'process/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/process', data);
      const { page, limit, search, searchCols, include, exclude } = getState().process || {};
      dispatch(fetchProcess({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Process added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Process Failed');
    }
  }
);

// Async thunk for edit process
export const editProcess = createAsyncThunk(
  'process/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/process/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().process || {};
      dispatch(fetchProcess({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Process updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Process Failed');
    }
  }
);

export const updateProcessStatus = createAsyncThunk(
  'process/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/process/status/${id}`, { status });
      // Optionally refetch Process
      const { page, limit, search, searchCols, include, exclude } = getState().process || {};
      dispatch(fetchProcess({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete Process
export const deleteProcess = createAsyncThunk(
  'process/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/process/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().process || {};
      dispatch(fetchProcess({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Process deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete process Failed');
    }
  }
);

const processSlice = createSlice({
  name: 'process',
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
    where: {},
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
    },
    setWhere: (state, action) => {
      state.where = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProcess.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchProcess.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllProcess.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProcess.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllProcess.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = processSlice.actions;
export default processSlice.reducer;
