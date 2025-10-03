import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get owner categories w/o pagination
export const fetchAllOwnerCategories = createAsyncThunk(
  'ownerCategory/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ownerCategory', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Owner Categories Failed');
    }
  }
);

// Async thunk for get OwnerCategory
export const fetchOwnerCategory = createAsyncThunk(
  'ownerCategory/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/ownerCategory', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Owner Category Failed');
    }
  }
);

// Async thunk for add Owner Category
export const addOwnerCategory = createAsyncThunk(
  'ownerCategory/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/ownerCategory', data);
      const { page, limit, search, searchCols, include, exclude } = getState().ownerCategory || {};
      dispatch(fetchOwnerCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Owner Category added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Owner Category Failed');
    }
  }
);

// Async thunk for edit Owner Category
export const editOwnerCategory = createAsyncThunk(
  'ownerCategory/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/ownerCategory/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().ownerCategory || {};
      dispatch(fetchOwnerCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Owner Category updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Owner Category Failed');
    }
  }
);

export const updateOwnerCategoryStatus = createAsyncThunk(
  'ownerCategory/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/ownerCategory/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().ownerCategory || {};
      dispatch(fetchOwnerCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete Owner Category
export const deleteOwnerCategory = createAsyncThunk(
  'ownerCategory/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/ownerCategory/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().ownerCategory || {};
      dispatch(fetchOwnerCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Owner Category deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Owner Category Failed');
    }
  }
);

const ownerCategorySlice = createSlice({
  name: 'ownerCategory',
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
      .addCase(fetchOwnerCategory.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnerCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchOwnerCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllOwnerCategories.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOwnerCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllOwnerCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = ownerCategorySlice.actions;
export default ownerCategorySlice.reducer;
