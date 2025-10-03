import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllMaker = createAsyncThunk(
  'maker/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/maker', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Maker Failed');
    }
  }
);

// Async thunk for get Maker
export const fetchMaker = createAsyncThunk(
  'maker/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/maker', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Maker Failed');
    }
  }
);

// Async thunk for add Maker
export const addMaker = createAsyncThunk(
  'maker/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/maker', data);
      const { page, limit, search, searchCols, include, exclude } = getState().maker || {};
      dispatch(fetchMaker({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Maker added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Maker Failed');
    }
  }
);

// Async thunk for edit Maker
export const editMaker = createAsyncThunk(
  'maker/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/maker/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().maker || {};
      dispatch(fetchMaker({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Maker updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Maker Failed');
    }
  }
);

export const updateMakerStatus = createAsyncThunk(
  'maker/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/maker/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().maker || {};
      dispatch(fetchMaker({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete maker
export const deleteMaker = createAsyncThunk(
  'maker/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/maker/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().maker || {};
      dispatch(fetchMaker({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Maker deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Maker Failed');
    }
  }
);

const makerSlice = createSlice({
  name: 'maker',
  initialState: {
    allData: [],
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    makers: [],
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
      .addCase(fetchMaker.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaker.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchMaker.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllMaker.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMaker.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllMaker.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = makerSlice.actions;
export default makerSlice.reducer;
