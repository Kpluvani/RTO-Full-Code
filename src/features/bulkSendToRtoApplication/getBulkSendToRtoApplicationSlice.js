import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig'

export const fetchSendToRtoApplications = createAsyncThunk(
  'send-to-rto-get-application/getAll',
  async ({ page, limit, search, searchCols, include, exclude, applicationNo, workType, where }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/bulk-send-to-rto/get-application', { params: { page, limit, search, searchCols, include, exclude, applicationNo, workType, where } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Applications Failed');
    }
  }
);

export const saveBulkSendToRtoEntry = createAsyncThunk(
  'send-to-rto-get-application/update',
  async (payload, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post('/bulk-send-to-rto/store-bulk-send-to-rto', payload);
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Data Entry failed');
    }
  }
);

const getBulkSendToRtoApplicationSlice = createSlice({
  name: 'bulkSendToRtoApplication',
  initialState: {
    data: [],
    total: 0,
    page: 1,
    limit: 1,
    where: {},
    search: "",
    searchCols: "application_number,file_number ",
    include: "",
    exclude: "is_delete",
    application_id: null,
    currApplication: null,
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
    setWhere: (state, action) => {
      state.where = action.payload;
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
    setApplicationId: (state, action) => {
      state.application_id = action.payload;
    },
    resetApplications: (state) => {
      state.data = [];
      state.total = 0;
      state.page = 1;
      state.limit = 1;
      state.where = {};
      state.search = "";
      state.searchCols = "application_number,file_number ";
      state.include = "";
      state.exclude = "is_delete";
      state.application_id = null;
      state.currApplication = null;
      state.status = "idle";
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSendToRtoApplications.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
        state.data = [];
      })
      .addCase(fetchSendToRtoApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || state.limit;
      })
      .addCase(fetchSendToRtoApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      .addCase(saveBulkSendToRtoEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sucsess = false;
        state.bulkResult = null;
      })
      .addCase(saveBulkSendToRtoEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.bulkResult = action.payload
      })
      .addCase(saveBulkSendToRtoEntry.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
        state.bulkResult = null;
      })
  },
})

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude, setApplicationId, resetApplications  } = getBulkSendToRtoApplicationSlice.actions;
export default getBulkSendToRtoApplicationSlice.reducer;