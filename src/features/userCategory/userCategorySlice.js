import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get workCategory w/o pagination
export const fetchAllUserCategories = createAsyncThunk(
  'user-category/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-category', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch User Categories Failed');
    }
  }
);

// Async thunk for get userCategory
export const fetchUserCategory = createAsyncThunk(
  'user-category/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user-category', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch User Category Failed');
    }
  }
);

// Async thunk for add  User Category 
export const addUserCategory = createAsyncThunk(
  'user-category/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/user-category', data);
      const { page, limit, search, searchCols, include, exclude } = getState().userCategory || {};
      dispatch(fetchUserCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'User Category added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add User Category Failed');
    }
  }
);

// Async thunk for edit  User Category 
export const editUserCategory = createAsyncThunk(
  'user-category/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/user-category/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().userCategory || {};
      dispatch(fetchUserCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'User Category updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update User Category Failed');
    }
  }
);

export const updateUserCategoryStatus = createAsyncThunk(
  'user-category/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/user-category/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().userCategory || {};
      dispatch(fetchUserCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete  User Category 
export const deleteUserCategory = createAsyncThunk(
  'user-category/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/user-category/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().userCategory || {};
      dispatch(fetchUserCategory({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'User Category deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete To User Category Failed');
    }
  }
);

const userCategorySlice = createSlice({
  name: 'userCategory',
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
      .addCase(fetchUserCategory.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchUserCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllUserCategories.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUserCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllUserCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = userCategorySlice.actions;
export default userCategorySlice.reducer;
