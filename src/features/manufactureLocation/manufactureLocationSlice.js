import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllManufactureLocation = createAsyncThunk(
  'manufacture-location/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/manufacture-location', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Manufacture Location Failed');
    }
  }
);

// Async thunk for get ManufactureLocation
export const fetchManufactureLocation = createAsyncThunk(
  'manufacture-location/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/manufacture-location', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Manufacture Location Failed');
    }
  }
);

// Async thunk for add ManufactureLocation
export const addManufactureLocation = createAsyncThunk(
  'manufacture-location/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/manufacture-location', data);
      const { page, limit, search, searchCols, include, exclude } = getState().manufactureLocation || {};
      dispatch(fetchManufactureLocation({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Manufacture Location added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Manufacture Location Failed');
    }
  }
);

// Async thunk for edit ManufactureLocation
export const editManufactureLocation = createAsyncThunk(
  'manufacture-location/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/manufacture-location/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().manufacture-location || {};
      dispatch(fetchManufactureLocation({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Manufacture Location updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Manufacture Location Failed');
    }
  }
);

export const updateManufactureLocationStatus = createAsyncThunk(
  'manufacture-location/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/manufacture-location/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().manufactureLocation || {};
      dispatch(fetchManufactureLocation({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete manufacture-location
export const deleteManufactureLocation = createAsyncThunk(
  'manufacture-location/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/manufacture-location/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().manufactureLocation || {};
      dispatch(fetchManufactureLocation({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Manufacture Location deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Manufacture Location Failed');
    }
  }
);

const manufactureLocationSlice = createSlice({
  name: 'manufactureLocation',
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
      .addCase(fetchManufactureLocation.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManufactureLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchManufactureLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllManufactureLocation.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllManufactureLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllManufactureLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = manufactureLocationSlice.actions;
export default manufactureLocationSlice.reducer;
