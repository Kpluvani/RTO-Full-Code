import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';
import { all } from 'axios';

export const fetchAllSubAgent = createAsyncThunk(
  'sub-agent/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/sub-agent', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch SubAgent Failed');
    }
  }
);

// Async thunk for get sub-agents
export const fetchSubAgents = createAsyncThunk(
  'sub-agent/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/sub-agent', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch SubAgents Failed');
    }
  }
);

// Async thunk for add sub-agent
export const addSubAgent = createAsyncThunk(
  'sub-agent/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/sub-agent', data);
      const { page, limit, search, searchCols, include, exclude } = getState().subAgent || {};
      dispatch(fetchSubAgents({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'SubAgent added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add SubAgent Failed');
    }
  }
);

// Async thunk for edit sub-agent
export const editSubAgent = createAsyncThunk(
  'sub-agent/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/sub-agent/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().subAgent || {};
      dispatch(fetchSubAgents({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'SubAgent updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update SubAgent Failed');
    }
  }
);

export const updateSubAgentStatus = createAsyncThunk(
  'sub-agent/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/sub-agent/status/${id}`, { status });
      // Optionally refetch subAgents
      const { page, limit, search, searchCols, include, exclude } = getState().subAgent || {};
      dispatch(fetchSubAgents({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete sub-agent
export const deleteSubAgent = createAsyncThunk(
  'sub-agent/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/sub-agent/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().subAgent || {};
      dispatch(fetchSubAgents({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'SubAgent deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete SubAgent Failed');
    }
  }
);

const subAgentSlice = createSlice({
  name: 'subAgent',
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
      .addCase(fetchSubAgents.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchSubAgents.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllSubAgent.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSubAgent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllSubAgent.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = subAgentSlice.actions;
export default subAgentSlice.reducer;
