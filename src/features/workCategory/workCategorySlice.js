import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get workCategory w/o pagination
export const fetchAllWorkCategories = createAsyncThunk(
  'workCategory/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/work-category', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Work Categories Failed');
    }
  }
);

// Async thunk for get workCategories
export const fetchWorkCategories = createAsyncThunk(
  'workCategory/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/work-category', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch workCategories Failed');
    }
  }
);

// Async thunk for add workCategory
export const addWorkCategory = createAsyncThunk(
  'workCategory/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/work-category', data);
      const { page, limit, search, searchCols, include, exclude } = getState().workCategory || {};
      dispatch(fetchWorkCategories({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'workCategory added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add workCategory Failed');
    }
  }
);

// Async thunk for edit workCategory
export const editWorkCategory = createAsyncThunk(
  'workCategory/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/work-category/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().workCategory || {};
      dispatch(fetchWorkCategories({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'workCategory updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update workCategory Failed');
    }
  }
);

export const updateWorkCategoryStatus = createAsyncThunk(
  'work-category/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/work-category/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().workCategory || {};
      dispatch(fetchWorkCategories({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete workCategory
export const deleteWorkCategory = createAsyncThunk(
  'workCategory/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/work-category/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().workCategory || {};
      dispatch(fetchWorkCategories({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'workCategory deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete workCategory Failed');
    }
  }
);

const workCategorySlice = createSlice({
  name: 'workCategory',
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
      .addCase(fetchWorkCategories.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchWorkCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllWorkCategories.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllWorkCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = workCategorySlice.actions;
export default workCategorySlice.reducer;
