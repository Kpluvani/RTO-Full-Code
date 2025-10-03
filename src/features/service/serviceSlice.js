import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get service w/o pagination
export const fetchAllService = createAsyncThunk(
  'service/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/service', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Service Failed');
    }
  }
);

// Async thunk for get service
export const fetchService = createAsyncThunk(
  'service/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/service', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Service Failed');
    }
  }
);

// Async thunk for add service
export const addService = createAsyncThunk(
  'service/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/service', data);
      const { page, limit, search, searchCols, include, exclude } = getState().service || {};
      dispatch(fetchService({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Service added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Service Failed');
    }
  }
);

// Async thunk for edit service
export const editService = createAsyncThunk(
  'service/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/service/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().service || {};
      dispatch(fetchService({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Service updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Service Failed');
    }
  }
);

export const updateServiceStatus = createAsyncThunk(
  'service/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/service/status/${id}`, { status });
      // Optionally refetch Service
      const { page, limit, search, searchCols, include, exclude } = getState().service || {};
      dispatch(fetchService({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete Service
export const deleteService = createAsyncThunk(
  'service/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/service/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().service || {};
      dispatch(fetchService({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Service deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete service Failed');
    }
  }
);

const serviceSlice = createSlice({
  name: 'service',
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
      .addCase(fetchService.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllService.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllService.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllService.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = serviceSlice.actions;
export default serviceSlice.reducer;
