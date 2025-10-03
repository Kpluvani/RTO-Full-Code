import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get districts
export const fetchAllInsuranceTypes = createAsyncThunk(
  'insuranceType/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/insurance-type', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Insurance Types Failed');
    }
  }
);

// Async thunk for get insuranceTypes
export const fetchInsuranceTypes = createAsyncThunk(
  'insuranceType/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/insurance-type', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch InsuranceTypes Failed');
    }
  }
);

// Async thunk for add insuranceType
export const addInsuranceType = createAsyncThunk(
  'insuranceType/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/insurance-type', data);
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceType || {};
      dispatch(fetchInsuranceTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'InsuranceType added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add InsuranceType Failed');
    }
  }
);

// Async thunk for edit insuranceType
export const editInsuranceType = createAsyncThunk(
  'insuranceType/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/insurance-type/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceType || {};
      dispatch(fetchInsuranceTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'InsuranceType updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update InsuranceType Failed');
    }
  }
);

export const updateInsuranceTypeStatus = createAsyncThunk(
  'insuranceType/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/insurance-type/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceType || {};
      dispatch(fetchInsuranceTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete insuranceType
export const deleteInsuranceType = createAsyncThunk(
  'insuranceType/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/insurance-type/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().insuranceType || {};
      dispatch(fetchInsuranceTypes({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'InsuranceType deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete InsuranceType Failed');
    }
  }
);

const insuranceTypeSlice = createSlice({
  name: 'insuranceType',
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
      .addCase(fetchInsuranceTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsuranceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchInsuranceTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllInsuranceTypes.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInsuranceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllInsuranceTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = insuranceTypeSlice.actions;
export default insuranceTypeSlice.reducer;
