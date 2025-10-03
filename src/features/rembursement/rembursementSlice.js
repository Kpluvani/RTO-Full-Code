import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';
import { all } from 'axios';

export const fetchAllRembursement = createAsyncThunk(
  'rembursement/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/rembursement', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Rembursement Failed');
    }
  }
);

// Async thunk for get rembursements
export const fetchRembursements = createAsyncThunk(
  'rembursement/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/rembursement', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Rembursements Failed');
    }
  }
);

// Async thunk for add rembursement
export const addRembursement = createAsyncThunk(
  'rembursement/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/rembursement', data);
      const { page, limit, search, searchCols, include, exclude } = getState().rembursement || {};
      dispatch(fetchRembursements({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Rembursement added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Rembursement Failed');
    }
  }
);

// Async thunk for edit rembursement
export const editRembursement = createAsyncThunk(
  'rembursement/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/rembursement/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().rembursement || {};
      dispatch(fetchRembursements({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Rembursement updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Rembursement Failed');
    }
  }
);

export const updateRembursementStatus = createAsyncThunk(
  'rembursement/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/rembursement/status/${id}`, { status });
      // Optionally refetch rembursements
      const { page, limit, search, searchCols, include, exclude } = getState().rembursement || {};
      dispatch(fetchRembursements({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete rembursement
export const deleteRembursement = createAsyncThunk(
  'rembursement/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/rembursement/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().rembursement || {};
      dispatch(fetchRembursements({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Rembursement deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Rembursement Failed');
    }
  }
);

const rembursementSlice = createSlice({
  name: 'rembursement',
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
      .addCase(fetchRembursements.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRembursements.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchRembursements.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllRembursement.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRembursement.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllRembursement.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = rembursementSlice.actions;
export default rembursementSlice.reducer;
