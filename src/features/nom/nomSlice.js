import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllNom = createAsyncThunk(
  'nom/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/noms', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch nom Failed');
    }
  }
);

// Async thunk for get noms
export const fetchNoms = createAsyncThunk(
  'nom/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/noms', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Noms Failed');
    }
  }
);

// Async thunk for add nom
export const addNom = createAsyncThunk(
  'nom/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/noms', data);
      const { page, limit, search, searchCols, include, exclude } = getState().nom || {};
      dispatch(fetchNoms({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Nom added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Nom Failed');
    }
  }
);

// Async thunk for edit nom
export const editNom = createAsyncThunk(
  'nom/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/noms/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().nom || {};
      dispatch(fetchNoms({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Nom updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Nom Failed');
    }
  }
);

export const updateNomStatus = createAsyncThunk(
  'noms/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/noms/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().nom || {};
      dispatch(fetchNoms({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete nom
export const deleteNom = createAsyncThunk(
  'nom/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/noms/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().nom || {};
      dispatch(fetchNoms({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Nom deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Nom Failed');
    }
  }
);

const nomSlice = createSlice({
  name: 'nom',
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
      .addCase(fetchNoms.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNoms.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchNoms.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllNom.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNom.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllNom.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = nomSlice.actions;
export default nomSlice.reducer;
