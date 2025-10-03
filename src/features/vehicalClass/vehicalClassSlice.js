import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get vehicle classes
export const fetchAllVehicalClasses = createAsyncThunk(
  'vehical-classes/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-classes', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Classes Failed');
    }
  }
);

// Async thunk for get Vehical Class
export const fetchVehicalClass = createAsyncThunk(
  'vehical-classes/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-classes', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Class Failed');
    }
  }
);

// Async thunk for add Vehical Class
export const addVehicalClass = createAsyncThunk(
  'vehical-classes/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/vehical-classes', data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalClass || {};
      dispatch(fetchVehicalClass({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Vehical Class added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Vehical Class Failed');
    }
  }
);

// Async thunk for edit Vehical Class
export const editVehicalClass = createAsyncThunk(
  'vehical-classes/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-classes/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalClass || {};
      dispatch(fetchVehicalClass({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Vehical Class updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Vehical Class Failed');
    }
  }
);


export const updateVehicalClassStatus = createAsyncThunk(
  'vehical-classes/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-classes/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalClass || {};
      dispatch(fetchVehicalClass({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);
// Async thunk for delete Vehical Class
export const deleteVehicalClass = createAsyncThunk(
  'vehical-classes/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/vehical-classes/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalClass || {};
      dispatch(fetchVehicalClass({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Vehical Class deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Vehical Class Failed');
    }
  }
);

const vehicalClassSlice = createSlice({
  name: 'vehicalClass',
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
      .addCase(fetchVehicalClass.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicalClass.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchVehicalClass.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllVehicalClasses.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVehicalClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllVehicalClasses.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = vehicalClassSlice.actions;
export default vehicalClassSlice.reducer;
