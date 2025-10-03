import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get ownership types w/o pagination
export const fetchAllOwnershipTypes = createAsyncThunk(
  'ownershipType/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ownershipType', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Ownership Type Failed');
    }
  }
);

// Async thunk for get OwnershipType
export const fetchOwnershipType = createAsyncThunk(
  'ownershipType/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ownershipType', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Ownership Type Failed');
    }
  }
);

// Async thunk for add Ownership Type
export const addOwnershipType = createAsyncThunk(
  'ownershipType/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/ownershipType', data);
      const { page, limit, search, searchCols, include, exclude } = getState().ownershipType || {};
      dispatch(fetchOwnershipType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Ownership Type added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Ownership Type Failed');
    }
  }
);

// Async thunk for edit Ownership Type
export const editOwnershipType = createAsyncThunk(
  'ownershipType/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/ownershipType/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().ownershipType || {};
      dispatch(fetchOwnershipType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Ownership Type updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Ownership Type Failed');
    }
  }
);

export const updateOwnershipTypeStatus = createAsyncThunk(
  'ownershipType/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/ownershipType/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().ownershipType || {};
      dispatch(fetchOwnershipType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete Ownership Type 
export const deleteOwnershipType = createAsyncThunk(
  'ownershipType/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/ownershipType/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().ownershipType || {};
      dispatch(fetchOwnershipType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Ownership Type deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Ownership Type Failed');
    }
  }
);

const ownershipTypeSlice = createSlice({
  name: 'ownershipType',
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
      .addCase(fetchOwnershipType.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnershipType.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchOwnershipType.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllOwnershipTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOwnershipTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllOwnershipTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = ownershipTypeSlice.actions;
export default ownershipTypeSlice.reducer;
