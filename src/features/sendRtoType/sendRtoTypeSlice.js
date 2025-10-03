import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';


export const fetchAllSendRtoType = createAsyncThunk(
  'send-to-rto-type/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/send-to-rto-type', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch All Hold Reasons Failed');
    }
  }
);
// Async thunk for get sendRtoType
export const fetchSendRtoType = createAsyncThunk(
  'send-to-rto-type/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/send-to-rto-type', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Send Rto Type Failed');
    }
  }
);

// Async thunk for add Send Rto Type
export const addSendRtoType = createAsyncThunk(
  'send-to-rto-type/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/send-to-rto-type', data);
      const { page, limit, search, searchCols, include, exclude } = getState().sendRtoType || {};
      dispatch(fetchSendRtoType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Send Rto Type added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Send Rto Type Failed');
    }
  }
);

// Async thunk for edit Send Rto Type
export const editSendRtoType = createAsyncThunk(
  'send-to-rto-type/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/send-to-rto-type/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().sendRtoType || {};
      dispatch(fetchSendRtoType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Send Rto Type updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Send Rto Type Failed');
    }
  }
);

export const updateSendRtoTypeStatus = createAsyncThunk(
  'send-to-rto-type/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/send-to-rto-type/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().sendRtoType || {};
      dispatch(fetchSendRtoType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete Send Rto Type
export const deleteSendRtoType = createAsyncThunk(
  'send-to-rto-type/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/send-to-rto-type/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().sendRtoType || {};
      dispatch(fetchSendRtoType({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Send Rto Type deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Send To Rto Type Failed');
    }
  }
);

const sendRtoTypeSlice = createSlice({
  name: 'sendRtoType',
  initialState: {
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
      .addCase(fetchSendRtoType.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSendRtoType.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchSendRtoType.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllSendRtoType.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSendRtoType.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllSendRtoType.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = sendRtoTypeSlice.actions;
export default sendRtoTypeSlice.reducer;
