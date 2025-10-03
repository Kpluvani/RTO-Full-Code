import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';
import { all } from 'axios';

export const fetchAllRemark = createAsyncThunk(
  'remark/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/remark', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Remark Failed');
    }
  }
);

// Async thunk for get Remarks
export const fetchRemarks = createAsyncThunk(
  'remark/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/remark', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Remarks Failed');
    }
  }
);

// Async thunk for add remark
export const addRemark = createAsyncThunk(
  'remark/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/remark', data);
      const { page, limit, search, searchCols, include, exclude } = getState().remark || {};
      dispatch(fetchRemarks({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Remark added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Remark Failed');
    }
  }
);

// Async thunk for edit remark
export const editRemark = createAsyncThunk(
  'remark/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/remark/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().remark || {};
      dispatch(fetchRemarks({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Remark updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Remark Failed');
    }
  }
);

export const updateRemarkStatus = createAsyncThunk(
  'remark/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/remark/status/${id}`, { status });
      // Optionally refetch Remarks
      const { page, limit, search, searchCols, include, exclude } = getState().remark || {};
      dispatch(fetchRemarks({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete remark
export const deleteRemark = createAsyncThunk(
  'remark/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/remark/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().remark || {};
      dispatch(fetchRemarks({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Remark deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Remark Failed');
    }
  }
);

const remarkSlice = createSlice({
  name: 'remark',
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
      .addCase(fetchRemarks.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemarks.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchRemarks.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllRemark.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRemark.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllRemark.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = remarkSlice.actions;
export default remarkSlice.reducer;
