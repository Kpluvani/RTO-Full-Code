import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get actions w/o pagination
export const fetchAllActions = createAsyncThunk(
  'action/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/action', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Actions Failed');
    }
  }
);

// Async thunk for get actions
export const fetchActions = createAsyncThunk(
  'action/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/action', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Actions Failed');
    }
  }
);

// Async thunk for add action
export const addAction = createAsyncThunk(
  'action/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/action', data);
      const { page, limit, search, searchCols, include, exclude } = getState().action || {};
      dispatch(fetchActions({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Action added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Action Failed');
    }
  }
);

// Async thunk for edit action
export const editAction = createAsyncThunk(
  'action/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/action/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().action || {};
      dispatch(fetchActions({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Action updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Action Failed');
    }
  }
);

export const updateActionStatus = createAsyncThunk(
  'action/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/action/status/${id}`, { status });
      // Optionally refetch actions
      const { page, limit, search, searchCols, include, exclude } = getState().action || {};
      dispatch(fetchActions({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete action
export const deleteAction = createAsyncThunk(
  'action/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/action/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().action || {};
      dispatch(fetchActions({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Action deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Action Failed');
    }
  }
);

const actionSlice = createSlice({
  name: 'action',
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
    where: {},
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
    },
    setWhere: (state, action) => {
      state.where = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActions.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchActions.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllActions.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllActions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllActions.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = actionSlice.actions;
export default actionSlice.reducer;
