import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get registrationType w/o pagination
export const fetchAllRegistrationTypes = createAsyncThunk(
  'registrationType/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/registrationType', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Registration Type Failed');
    }
  }
);

// Async thunk for get registrationType
export const fetchRegistrationType = createAsyncThunk(
  'registrationType/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/registrationType', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Registration Type Failed');
    }
  }
);

// Async thunk for add Registration Type
export const addRegistrationType = createAsyncThunk(
  'registrationType/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/registrationType', data);
      const { page, limit, search, searchCols, include, exclude } = getState().registrationType || {};
      dispatch(fetchRegistrationType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Registration Type added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Registration Type Failed');
    }
  }
);

// Async thunk for edit Registration Type
export const editRegistrationType = createAsyncThunk(
  'registrationType/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/registrationType/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().registrationType || {};
      dispatch(fetchRegistrationType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Registration Type updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Registration Type Failed');
    }
  }
);

export const updateRegistrationTypeStatus = createAsyncThunk(
  'registrationType/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/registrationType/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().registrationType || {};
      dispatch(fetchRegistrationType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete Registration Type
export const deleteRegistrationType = createAsyncThunk(
  'registrationType/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/registrationType/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().registrationType || {};
      dispatch(fetchRegistrationType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Registration Type deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Registration Type Failed');
    }
  }
);

const registrationTypeSlice = createSlice({
  name: 'registrationType',
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
      .addCase(fetchRegistrationType.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegistrationType.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchRegistrationType.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllRegistrationTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRegistrationTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllRegistrationTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = registrationTypeSlice.actions;
export default registrationTypeSlice.reducer;
