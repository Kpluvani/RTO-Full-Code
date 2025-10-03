import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get user w/o pagination
export const fetchAllUsers = createAsyncThunk(
  'user/getAllWithoutPagination',
  async ({ include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user', { params: { include, exclude, where: { is_active: true, ...where } } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Users Failed');
    }
  }
);

// Async thunk for get user
export const fetchUsers = createAsyncThunk(
  'user/getAll',
  async ({ page, limit, search, searchCols, include, exclude, where } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/user', { params: { page, limit, search, searchCols, include, exclude, where } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch User Failed');
    }
  }
);

// Async thunk for fetching user profile //
export const fetchUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try{
      const response = await axios.get('/user/profile');
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Profile Failed')
    }
  }
)

// Async thunk for add  User 
export const addUser = createAsyncThunk(
  'user/add',
  async (data, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.post('/user', data);
      const { page, limit, search, searchCols, include, exclude, where } = getState().user || {};
      dispatch(fetchUsers({ page, limit, search, searchCols, include, exclude, where }));
      return fulfillWithValue(response?.data?.message || 'User added successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Add User Failed');
    }
  }
);

// Async thunk for edit  User 
export const editUser = createAsyncThunk(
  'user/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/user/${id}`, data);
      const { page, limit, search, searchCols, include, exclude, where } = getState().user || {};
      dispatch(fetchUsers({ page, limit, search, searchCols, include, exclude, where }));
      return fulfillWithValue(response?.data?.message || 'User updated successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update User Failed');
    }
  }
);

export const editPassword = createAsyncThunk(
  'user/edit',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {    
    try {
      const response = await axios.put(`/user/${id}`, data);
      dispatch(fetchUserById(id)); 
      dispatch(fetchUserProfile(id));
      return fulfillWithValue(response?.data?.message || 'User Password successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Update User Failed');
    }
  }
);

export const userUpdatePassword = createAsyncThunk(
  'user/updatePassword',
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.put(`/user/update-password`, data);      
      return fulfillWithValue(response?.data?.message || "Password updated successfully");
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update Password Failed');
    }
  }
);

// Async thunk for delete  User 
export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.delete(`/user/${id}`);
      const { page, limit, search, searchCols, include, exclude, where } = getState().user || {};
      dispatch(fetchUsers({ page, limit, search, searchCols, include, exclude, where }));
      return fulfillWithValue(response?.data?.message || 'User deleted successfully');
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Delete To User Failed');
    }
  }
);

// Async thunk for get user
export const fetchUserById = createAsyncThunk(
  'user/getById',
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.get(`/user/${id}`);
      return fulfillWithValue(response.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch User Failed');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'user/updateStatus',
  async ({ id, status }, { rejectWithValue, fulfillWithValue, dispatch, getState }) => {
    try {
      const response = await axios.put(`/user/status/${id}`, { status });
      // Optionally refetch 
      const { page, limit, search, searchCols, include, exclude, where } = getState().user || {};
      dispatch(fetchUsers({ page, limit, search, searchCols, include, exclude, where }));
      return fulfillWithValue(response?.data?.message || 'User Status updated');
    } catch (err) {
      console.log('<<err--', err);
      return rejectWithValue(err.response?.data?.error || 'Update Status Failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    allData: [],
    data: [],
    profile: {},
    total: 0,
    page: 1,
    limit: 10,
    search: "",
    searchCols: "name",
    include: "id,name,user_name,is_active,rto_id",
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
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all data without pagination
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allData = action.payload?.data || [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload || {}; 
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(userUpdatePassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(userUpdatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(userUpdatePassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(editPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(editPassword.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {        
        state.profile = action.payload || [];
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude, setWhere } = userSlice.actions;
export default userSlice.reducer;
