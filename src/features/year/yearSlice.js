import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllYear = createAsyncThunk(
  'year/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/year', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Year Failed');
    }
  }
);

// Async thunk for get Year
export const fetchYear = createAsyncThunk(
  'year/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/year', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Year Failed');
    }
  }
);

// Async thunk for add Year
export const addYear = createAsyncThunk(
  'year/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/year', data);
      const { page, limit, search, searchCols, include, exclude } = getState().year || {};
      dispatch(fetchYear({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Year added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Year Failed');
    }
  }
);

// Async thunk for edit Year
export const editYear = createAsyncThunk(
  'year/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/year/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().year || {};
      dispatch(fetchYear({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Year updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Year Failed');
    }
  }
);

export const updateYearStatus = createAsyncThunk(
  'year/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/year/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().year || {};
      dispatch(fetchYear({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete year
export const deleteYear = createAsyncThunk(
  'year/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/year/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().year || {};
      dispatch(fetchYear({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Year deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Year Failed');
    }
  }
);

const yearSlice = createSlice({
  name: 'year',
  initialState: {
    allData: [],
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    years: [],
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
      .addCase(fetchYear.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYear.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchYear.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllYear.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllYear.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllYear.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = yearSlice.actions;
export default yearSlice.reducer;
