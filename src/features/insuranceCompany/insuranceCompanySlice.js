import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get districts
export const fetchAllInsuranceCompanies = createAsyncThunk(
  'insurance-company/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/insurance-company', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Insurance Companies Failed');
    }
  }
);

// Async thunk for get Insurance Company
export const fetchInsuranceCompany = createAsyncThunk(
  'insurance-company/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/insurance-company', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Insurance Company Failed');
    }
  }
);

// Async thunk for add Insurance Company
export const addInsuranceCompany = createAsyncThunk(
  'insurance-company/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/insurance-company', data);
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceCompany || {};
      dispatch(fetchInsuranceCompany({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Insurance Company added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add Insurance Company Failed');
    }
  }
);

// Async thunk for edit Insurance Company
export const editInsuranceCompany = createAsyncThunk(
  'insurance-company/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/insurance-company/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceCompany || {};
      dispatch(fetchInsuranceCompany({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Insurance Company updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Insurance Company Failed');
    }
  }
);

export const updateInsuranceCompanyStatus = createAsyncThunk(
  'insurance-company/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/insurance-company/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceCompany || {};
      dispatch(fetchInsuranceCompany({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete insurance-company
export const deleteInsuranceCompany = createAsyncThunk(
  'insurance-company/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/insurance-company/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceCompany || {};
      dispatch(fetchInsuranceCompany({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Insurance Company deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete Insurance Company Failed');
    }
  }
);

const insuranceCompanySlice = createSlice({
  name: 'insuranceCompany',
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
      .addCase(fetchInsuranceCompany.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsuranceCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchInsuranceCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllInsuranceCompanies.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInsuranceCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllInsuranceCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = insuranceCompanySlice.actions;
export default insuranceCompanySlice.reducer;
