import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get districts
export const fetchAllDocumentTypes = createAsyncThunk(
  'documentType/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/document-type', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Document Types Failed');
    }
  }
);

// Async thunk for get documentTypes
export const fetchDocumentTypes = createAsyncThunk(
  'documentType/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/document-type', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch DocumentTypes Failed');
    }
  }
);

// Async thunk for add documentType
export const addDocumentType = createAsyncThunk(
  'documentType/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/document-type', data);
      const { page, limit, search, searchCols, include, exclude } = getState().documentType || {};
      dispatch(fetchDocumentTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'DocumentType added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add DocumentType Failed');
    }
  }
);

// Async thunk for edit documentType
export const editDocumentType = createAsyncThunk(
  'documentType/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/document-type/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().documentType || {};
      dispatch(fetchDocumentTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'DocumentType updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update DocumentType Failed');
    }
  }
);

export const updateDocumentTypeStatus = createAsyncThunk(
  'documentType/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/document-type/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().documentType || {};
      dispatch(fetchDocumentTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete documentType
export const deleteDocumentType = createAsyncThunk(
  'documentType/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/document-type/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().documentType || {};
      dispatch(fetchDocumentTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'DocumentType deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete DocumentType Failed');
    }
  }
);

const documentTypeSlice = createSlice({
  name: 'documentType',
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
      .addCase(fetchDocumentTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchDocumentTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllDocumentTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDocumentTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllDocumentTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = documentTypeSlice.actions;
export default documentTypeSlice.reducer;
