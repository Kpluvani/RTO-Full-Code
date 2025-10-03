import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

export const fetchAllOwners = createAsyncThunk(
  'owner/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/owner', { params: { include, exclude, where } });
      console.log('Fetch All Owners Response:', response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Owner Failed');
    }
  }
);

const ownerSlice = createSlice({
  name: 'owner',
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
        .addCase(fetchAllOwners.pending, (state) => {
            state.status = 'loading';
            state.loading = true;
            state.error = null;
        })  
        .addCase(fetchAllOwners.fulfilled, (state, action) => {
            console.log("Reducer hit with:", action.payload);
            state.loading = false;
            state.error = null;
            state.allData = action.payload?.data || [];
            state.total = action.payload?.total || 0;
        })       
        .addCase(fetchAllOwners.rejected, (state, action) => {
            state.status = 'failed';    
            state.loading = false;
            state.error = action.payload;
        }); 
      
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude } = ownerSlice.actions;
export default ownerSlice.reducer;