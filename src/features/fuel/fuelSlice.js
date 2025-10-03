import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllFuel = createAsyncThunk(
  'fuel/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/fuel', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch fuel Failed');
    }
  }
);

// Async thunk for get fuels
export const fetchFuels = createAsyncThunk(
  'fuel/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/fuel', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Fuels Failed');
    }
  }
);

// Async thunk for add fuel
export const addFuel = createAsyncThunk(
  'fuel/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/fuel', data);
      const { page, limit, search, searchCols, include, exclude } = getState().fuel || {};
      dispatch(fetchFuels({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Fuel added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Fuel Failed');
    }
  }
);

// Async thunk for edit fuel
export const editFuel = createAsyncThunk(
  'fuel/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/fuel/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().fuel || {};
      dispatch(fetchFuels({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Fuel updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Fuel Failed');
    }
  }
);

export const updateFuelStatus = createAsyncThunk(
  'fuel/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/fuel/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().fuel || {};
      dispatch(fetchFuels({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete fuel
export const deleteFuel = createAsyncThunk(
  'fuel/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/fuel/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().fuel || {};
      dispatch(fetchFuels({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Fuel deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Fuel Failed');
    }
  }
);

const fuelSlice = createSlice({
  name: 'fuel',
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
      .addCase(fetchFuels.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFuels.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchFuels.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllFuel.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFuel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllFuel.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = fuelSlice.actions;
export default fuelSlice.reducer;
