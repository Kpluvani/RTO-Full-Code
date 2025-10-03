import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get vehicle categories
export const fetchAllVehicalCategories = createAsyncThunk(
  'vehical-category/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-category', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Categories Failed');
    }
  }
);

// Async thunk for get Vehical Category
export const fetchVehicalCategory = createAsyncThunk(
  'vehical-category/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/vehical-category', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Vehical Category Failed');
    }
  }
);

// Async thunk for add Vehical Category 
export const addVehicalCategory = createAsyncThunk(
  'vehical-category/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/vehical-category', data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalCategory || {};
      dispatch(fetchVehicalCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Vehical Category added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add  Vehical Category Failed');
    }
  }
);

// Async thunk for edit   Vehical Category 
export const editVehicalCategory = createAsyncThunk(
  'vehical-category/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-category/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalCategory || {};
      dispatch(fetchVehicalCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || ' Vehical Category updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update  Vehical Category Failed');
    }
  }
);

export const updateVehicalCategoryStatus = createAsyncThunk(
  'vehical-category/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/vehical-category/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalCategory || {};
      dispatch(fetchVehicalCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete   Vehical Category 
export const deleteVehicalCategory = createAsyncThunk(
  'vehical-category/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/vehical-category/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().vehicalCategory || {};
      dispatch(fetchVehicalCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'vehical Category deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete To vehical Category Failed');
    }
  }
);

const vehicalCategorySlice = createSlice({
  name: 'vehicalCategory',
  initialState: {
    allDate: [],
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
      .addCase(fetchVehicalCategory.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicalCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchVehicalCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllVehicalCategories.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllVehicalCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllVehicalCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = vehicalCategorySlice.actions;
export default vehicalCategorySlice.reducer;
