import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get vehicalPurchaseTypes
export const fetchVehicalPurchaseTypes = createAsyncThunk(
  'vehicalPurchaseType/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-Purchase-type', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Purchase Type Failed');
    }
  }
);

// Async thunk for add vehicalPurchaseType
export const addVehicalPurchaseType = createAsyncThunk(
  'vehicalPurchaseType/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/vehical-Purchase-type', data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalPurchaseType || {};
      dispatch(fetchVehicalPurchaseTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'VehicalPurchaseType added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add VehicalPurchaseType Failed');
    }
  }
);

// Async thunk for edit vehicalPurchaseType
export const editVehicalPurchaseType = createAsyncThunk(
  'vehicalPurchaseType/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-Purchase-type/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalPurchaseType || {};
      dispatch(fetchVehicalPurchaseTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'VehicalPurchaseType updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update VehicalPurchaseType Failed');
    }
  }
);

export const updateVehicalPurchaseTypeStatus = createAsyncThunk(
  'vehicalPurchaseType/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-Purchase-type/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalPurchaseType || {};
      dispatch(fetchVehicalPurchaseTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete vehicalPurchaseType
export const deleteVehicalPurchaseType = createAsyncThunk(
  'vehicalPurchaseType/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/vehical-Purchase-type/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalPurchaseType || {};
      dispatch(fetchVehicalPurchaseTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'VehicalPurchaseType deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete VehicalPurchaseType Failed');
    }
  }
);

const vehicalPurchaseTypeSlice = createSlice({
  name: 'vehicalPurchaseType',
  initialState: {
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
      .addCase(fetchVehicalPurchaseTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicalPurchaseTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchVehicalPurchaseTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = vehicalPurchaseTypeSlice.actions;
export default vehicalPurchaseTypeSlice.reducer;
