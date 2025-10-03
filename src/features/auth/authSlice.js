import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';
import { setAuthToken } from '../../config/axiosConfig';
// Read initial values from localStorage
const token = localStorage.getItem('token');
const isAdmin = localStorage.getItem('isAdmin') === 'true';
const is_pwd_update = localStorage.getItem('is_pwd_update') === 'true';
const userId = localStorage.getItem('userId');

setAuthToken(token);

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', {
        username,
        password,
      });
      return response.data; // Expecting token and isAdmin from response
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ user_id, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/verify-otp', {
        user_id,
        otp,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    isAdmin: isAdmin || false,
    showOtp: false,
    userId: userId || null,
    is_pwd_update: is_pwd_update || false,
    status: 'idle',
    loading: false,
    error: null,
    otpStatus: 'idle',
    otpLoading: false,
    otpError: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAdmin = false;
      state.showOtp = false;
      state.userId = null;
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userId');
      localStorage.removeItem('is_pwd_update');
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.limit = action.payload;
    },
    setUserId: (state, action) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;        
        if (action.payload.showOtp) {
          state.status = 'succeeded';
          state.isAdmin = false;
          state.showOtp = action.payload.showOtp;
          state.userId = action.payload.userId;
          state.is_pwd_update = action.payload.is_pwd_update || false;
          localStorage.removeItem('token');
          // Save to localStorage
          // localStorage.setItem('token', null);
          localStorage.setItem('isAdmin', false);
          // Save userId for OTP verification
          localStorage.setItem('userId', action.payload.userId);
          localStorage.setItem('is_pwd_update', action.payload.is_pwd_update || false)
        } else if (action.payload.token) {
          state.status = 'succeeded';
          
          state.token = action.payload.token;
          // state.isAdmin = action.payload.isAdmin;
          state.isAdmin = action?.payload?.user?.is_admin;
          state.showOtp = false;
          state.userId = null;
          state.is_pwd_update = action.payload.is_pwd_update || false;
          // Save to localStorage
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('isAdmin', action?.payload?.user?.is_admin);
          localStorage.setItem('is_pwd_update', action.payload.is_pwd_update || false);
          localStorage.removeItem('userId');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('userId');
          localStorage.removeItem('is_pwd_update');
          state.status = 'failed';
          state.error = action.payload.message;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // OTP verification
      .addCase(verifyOtp.pending, (state) => {
        state.otpStatus = 'loading';
        state.otpLoading = true;
        state.otpError = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.otpLoading = false;
        if (action.payload.is_verified) {
          state.otpStatus = 'succeeded';
          state.showOtp = false;
          state.token = action.payload.token;
          state.isAdmin = action.payload.isAdmin;
          state.is_pwd_update = action.payload.is_pwd_update;
          // Save to localStorage
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('isAdmin', action.payload.isAdmin);
          localStorage.setItem('is_pwd_update', action.payload.is_pwd_update);
          localStorage.removeItem('userId');
        } else {
          state.otpStatus = 'failed';
          state.otpError = action.payload.message;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.otpStatus = 'failed';
        state.otpLoading = false;
        state.otpError = action.payload;
      });
  },
});

export const { logout, setToken, setIsAdmin, setUserId } = authSlice.actions;
export default authSlice.reducer;
