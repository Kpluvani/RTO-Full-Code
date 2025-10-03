import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllMakerModel = createAsyncThunk(
  'maker-model/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/maker-model', { params: { include, exclude, where: { status: true, ...where }  } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Maker Models Failed');
    }
  }
);

// Async thunk for get Maker Model
export const fetchMakerModel = createAsyncThunk(
  'maker-model/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/maker-model', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Maker Models Failed');
    }
  }
);

// Async thunk for add Maker Model
export const addMakerModel = createAsyncThunk(
  'maker-model/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/maker-model', data);
      const { page, limit, search, searchCols, include, exclude } = getState().makerModel || {};
      dispatch(fetchMakerModel({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Maker Model added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Maker Model Failed');
    }
  }
);

// Async thunk for edit Maker Model
export const editMakerModel = createAsyncThunk(
  'maker-model/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/maker-model/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().makerModel || {};
      dispatch(fetchMakerModel({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Maker Model updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Maker Model Failed');
    }
  }
);

export const updateMakerModelStatus = createAsyncThunk(
  'maker-model/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/maker-model/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().makerModel || {};
      dispatch(fetchMakerModel({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete maker Model
export const deleteMakerModel = createAsyncThunk(
  'maker-model/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/maker-model/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().makerModel || {};
      dispatch(fetchMakerModel({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Maker Model deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Maker Model Failed');
    }
  }
);


const MakerModelSlice = createSlice({
  name: 'MakerModel',
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
      .addCase(fetchMakerModel.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMakerModel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchMakerModel.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllMakerModel.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMakerModel.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllMakerModel.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = MakerModelSlice.actions;
export default MakerModelSlice.reducer;
