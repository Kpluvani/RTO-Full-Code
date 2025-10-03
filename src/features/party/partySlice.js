import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllParty = createAsyncThunk(
  'party/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/party', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch party Failed');
    }
  }
);

// Async thunk for get partys
export const fetchPartys = createAsyncThunk(
  'party/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/party', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Partys Failed');
    }
  }
);

// Async thunk for add party
export const addParty = createAsyncThunk(
  'party/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/party', data);
      const { page, limit, search, searchCols, include, exclude } = getState().party || {};
      dispatch(fetchPartys({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Party added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Party Failed');
    }
  }
);

// Async thunk for edit party
export const editParty = createAsyncThunk(
  'party/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/party/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().party || {};
      dispatch(fetchPartys({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Party updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Party Failed');
    }
  }
);

export const updatePartyStatus = createAsyncThunk(
  'party/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/party/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().party || {};
      dispatch(fetchPartys({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete party
export const deleteParty = createAsyncThunk(
  'party/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/party/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().party || {};
      dispatch(fetchPartys({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Party deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Party Failed');
    }
  }
);

const partySlice = createSlice({
  name: 'party',
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
      .addCase(fetchPartys.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPartys.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchPartys.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllParty.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllParty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllParty.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = partySlice.actions;
export default partySlice.reducer;
