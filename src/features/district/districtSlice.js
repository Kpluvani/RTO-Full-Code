import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get districts
export const fetchAllDistricts = createAsyncThunk(
  'district/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/district', { params: { include, exclude, where: { status: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Districts Failed');
    }
  }
);

// Async thunk for get districts
export const fetchDistricts = createAsyncThunk(
  'district/getAll',
  async ({ page, limit, search, searchCols, include, exclude }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/district', { params: { page, limit, search, searchCols, include, exclude } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Districts Failed');
    }
  }
);

// Async thunk for add district
export const addDistrict = createAsyncThunk(
  'district/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/district', data);
      const { page, limit, search, searchCols, include, exclude } = getState().district || {};
      dispatch(fetchDistricts({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'District added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add District Failed');
    }
  }
);

// Async thunk for edit district
export const editDistrict = createAsyncThunk(
  'district/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/district/${id}`, data);
      const { page, limit, search, searchCols, include, exclude } = getState().district || {};
      dispatch(fetchDistricts({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'District updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update District Failed');
    }
  }
);

export const updateDistrictStatus = createAsyncThunk(
  'district/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/district/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude } = getState().district || {};
      dispatch(fetchDistricts({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'Status updated');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

// Async thunk for delete district
export const deleteDistrict = createAsyncThunk(
  'district/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/district/${id}`);
      const { page, limit, search, searchCols, include, exclude } = getState().district || {};
      dispatch(fetchDistricts({ page, limit, search, searchCols, include, exclude }));
      return fulfillWithValue(response?.data?.message || 'District deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete District Failed');
    }
  }
);

const districtSlice = createSlice({
  name: 'district',
  initialState: {
    allData: [],
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    search: "",
    searchCols: "",
    include: "",
    exclude: "is_delete",
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (district, action) => {
      district.page = action.payload;
    },
    setLimit: (district, action) => {
      district.limit = action.payload;
    },
    setSearch: (district, action) => {
      district.search = action.payload;
    },
    setSearchCols: (district, action) => {
      district.searchCols = action.payload;
    },
    setInclude: (district, action) => {
      district.include = action.payload;
    },
    setExclude: (district, action) => {
      district.exclude = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
    // fetch all data with pagination
      .addCase(fetchDistricts.pending, (district) => {
        district.status = 'loading';
        district.loading = true;
        district.error = null;
      })
      .addCase(fetchDistricts.fulfilled, (district, action) => {
        district.loading = false;
        district.error = null;
        district.data = action.payload?.data || [];
        district.total = action.payload?.total || 0;
        district.page = action.payload?.page || 1;
        district.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchDistricts.rejected, (district, action) => {
        district.status = 'failed';
        district.loading = false;
        district.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllDistricts.pending, (district) => {
        district.status = 'loading';
        district.loading = true;
        district.error = null;
      })
      .addCase(fetchAllDistricts.fulfilled, (district, action) => {
        district.loading = false;
        district.error = null;
        district.allData = action.payload?.data || [];
      })
      .addCase(fetchAllDistricts.rejected, (district, action) => {
        district.status = 'failed';
        district.loading = false;
        district.error = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = districtSlice.actions;
export default districtSlice.reducer;
