import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get process w/o pagination
export const fetchApplicationProcessStatus = createAsyncThunk(
  'applicationProcessStatus/getAllWithoutPagination',
  async (application_id, { rejectWithValue }) => {
    try {
      const response = await axios.get('/application/status', { params: { application_id } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Application fetch failed');
    }
  }
);

const applicationProcessStatusSlice = createSlice({
  name: 'applicationProcessStatus',
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
      // fetch all data without pagination
      .addCase(fetchApplicationProcessStatus.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationProcessStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchApplicationProcessStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = applicationProcessStatusSlice.actions;
export default applicationProcessStatusSlice.reducer;
