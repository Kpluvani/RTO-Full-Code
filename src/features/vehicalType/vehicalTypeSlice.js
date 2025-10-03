import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get VehicalType w/o pagination
export const fetchAllVehicalType = createAsyncThunk(
  'vehical-type/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-type', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Type Failed');
    }
  }
);

// Async thunk for get vehicalType
export const fetchVehicalType = createAsyncThunk(
  'vehical-type/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-type', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Type Failed');
    }
  }
);

// Async thunk for add  Vehical Type 
export const addVehicalType = createAsyncThunk(
  'vehical-type/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/vehical-type', data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalType || {};
      dispatch(fetchVehicalType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Vehical Type added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Vehical Type Failed');
    }
  }
);

// Async thunk for edit  Vehical Type 
export const editVehicalType = createAsyncThunk(
  'vehical-type/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-type/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalType || {};
      dispatch(fetchVehicalType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Vehical Type updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Vehical Type Failed');
    }
  }
);

export const updateVehicalTypeStatus = createAsyncThunk(
  'vehical-type/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-type/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalType || {};
      dispatch(fetchVehicalType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete  Vehical Type 
export const deleteVehicalType = createAsyncThunk(
  'vehical-type/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/vehical-type/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalType || {};
      dispatch(fetchVehicalType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Vehical Type deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete To Vehical Type Failed');
    }
  }
);

const vehicalTypeSlice = createSlice({
  name: 'vehicalType',
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
      .addCase(fetchVehicalType.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicalType.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchVehicalType.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllVehicalType.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVehicalType.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllVehicalType.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = vehicalTypeSlice.actions;
export default vehicalTypeSlice.reducer;
