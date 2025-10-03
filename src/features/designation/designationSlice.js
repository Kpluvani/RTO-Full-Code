import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get designations w/o pagination
export const fetchAllDesignations = createAsyncThunk(
  'designation/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/designation', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Designations Failed');
    }
  }
);

// Async thunk for get designations
export const fetchDesignations = createAsyncThunk(
  'designation/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/designation', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Designations Failed');
    }
  }
);

// Async thunk for add designation
export const addDesignation = createAsyncThunk(
  'designation/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/designation', data);
      const { page, limit, search, searchCols, include, exclude } = getState().designation || {};
      dispatch(fetchDesignations({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Designation added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Designation Failed');
    }
  }
);

// Async thunk for edit designation
export const editDesignation = createAsyncThunk(
  'designation/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/designation/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().designation || {};
      dispatch(fetchDesignations({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Designation updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Designation Failed');
    }
  }
);

export const updateDesignationStatus = createAsyncThunk(
  'designation/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/designation/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().designation || {};
      dispatch(fetchDesignations({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete designation
export const deleteDesignation = createAsyncThunk(
  'designation/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/designation/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().designation || {};
      dispatch(fetchDesignations({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Designation deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Designation Failed');
    }
  }
);

const designationSlice = createSlice({
  name: 'designation',
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
      .addCase(fetchDesignations.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllDesignations.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllDesignations.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = designationSlice.actions;
export default designationSlice.reducer;
