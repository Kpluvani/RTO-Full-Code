import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllVehicalBodyTypes = createAsyncThunk(
  'vehicalBodyType/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-body-type', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch vehical-body-type Failed');
    }
  }
);

// Async thunk for get vehicalBodyTypes
export const fetchVehicalBodyTypes = createAsyncThunk(
  'vehicalBodyType/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-body-type', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Body Type Failed');
    }
  }
);

// Async thunk for add vehicalBodyType
export const addVehicalBodyType = createAsyncThunk(
  'vehicalBodyType/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/vehical-body-type', data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalBodyType || {};
      dispatch(fetchVehicalBodyTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'VehicalBodyType added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add VehicalBodyType Failed');
    }
  }
);

// Async thunk for edit vehicalBodyType
export const editVehicalBodyType = createAsyncThunk(
  'vehicalBodyType/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-body-type/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalBodyType || {};
      dispatch(fetchVehicalBodyTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'VehicalBodyType updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update VehicalBodyType Failed');
    }
  }
);

export const updateVehicalBodyTypeStatus = createAsyncThunk(
  'vehicalBodyType/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-body-type/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalBodyType || {};
      dispatch(fetchVehicalBodyTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete vehicalBodyType
export const deleteVehicalBodyType = createAsyncThunk(
  'vehicalBodyType/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/vehical-body-type/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalBodyType || {};
      dispatch(fetchVehicalBodyTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'VehicalBodyType deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete VehicalBodyType Failed');
    }
  }
);

const vehicalBodyTypeSlice = createSlice({
  name: 'vehicalBodyType',
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
      .addCase(fetchVehicalBodyTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicalBodyTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchVehicalBodyTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllVehicalBodyTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVehicalBodyTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllVehicalBodyTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = vehicalBodyTypeSlice.actions;
export default vehicalBodyTypeSlice.reducer;
