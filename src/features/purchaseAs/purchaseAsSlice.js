import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get purchase As w/o pagination
export const fetchAllPurchaseAses = createAsyncThunk(
  'purchaseAs/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/purchase-as', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Purchase As Failed');
    }
  }
);

// Async thunk for get PurchaseAses
export const fetchPurchaseAses = createAsyncThunk(
  'purchaseAs/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/purchase-as', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch PurchaseAses Failed');
    }
  }
);

// Async thunk for add purchaseAs
export const addPurchaseAs = createAsyncThunk(
  'purchaseAs/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/purchase-as', data);
      const { page, limit, search, searchCols, include, exclude } = getState().purchaseAs || {};
      dispatch(fetchPurchaseAses({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'PurchaseAs added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add PurchaseAs Failed');
    }
  }
);

// Async thunk for edit PurchaseAs
export const editPurchaseAs = createAsyncThunk(
  'purchaseAs/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/purchase-as/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().purchaseAs || {};
      dispatch(fetchPurchaseAses({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'PurchaseAs updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update PurchaseAs Failed');
    }
  }
);

export const updatePurchaseAsStatus = createAsyncThunk(
  'purchaseAs/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/purchase-as/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().purchaseAs || {};
      dispatch(fetchPurchaseAses({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete purchaseAs
export const deletePurchaseAs = createAsyncThunk(
  'purchaseAs/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/purchase-as/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().purchaseAs || {};
      dispatch(fetchPurchaseAses({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'PurchaseAs deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete PurchaseAs Failed');
    }
  }
);

const purchaseAsSlice = createSlice({
  name: 'purchaseAs',
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
      .addCase(fetchPurchaseAses.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseAses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchPurchaseAses.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllPurchaseAses.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPurchaseAses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllPurchaseAses.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = purchaseAsSlice.actions;
export default purchaseAsSlice.reducer;
