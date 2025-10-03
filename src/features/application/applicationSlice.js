import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get applications
export const fetchApplications = createAsyncThunk(
  'application/getAll',
  async ({ page, limit, search, searchCols, include, exclude, applicationNo, workType, where  }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/application', { params: { page, limit, search, searchCols, include, exclude, applicationNo, workType, where } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Applications Failed');
    }
  }
);

// Async thunk for get application by id
export const fetchApplicationById = createAsyncThunk(
  'application/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get('/application/getByIdOrNumber', { params: { id } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Application fetch failed');
    }
  }
);

//Async thunk for new registartion of application
export const registerNewApplication = createAsyncThunk(
  'application/register',
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post('/application', data);
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Application registeration failed');
    }
  }
);

//Async thunk for new registartion of application
export const saveDataEntry = createAsyncThunk(
  'application/update',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const response = await axios.post('/application/data-entry', { id, data });
      dispatch(fetchApplicationById(id));
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Data Entry failed');
    }
  }
);

//Async thunk for new registartion of application
export const saveServiceEntry = createAsyncThunk(
  'application/update',
  async ({ id, data }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post('/application/service-entry', { id, data });
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Data Entry failed');
    }
  }
);

//Async thunk for new registartion of application
export const savefeedback = createAsyncThunk(
  'application/update',
  async ({ id, data }, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const response = await axios.post('/application/feedback', { id, data });

      console.log('✅ Feedback saved response:', response.data);

      dispatch(fetchApplicationById(id));
      return fulfillWithValue(response?.data);
    } catch (err) {
      console.error('Feedback save error:', err);
      return rejectWithValue(err.response?.data?.error || 'Save Data Entry failed');
    }
  }
);


export const getApplicationByOwner = createAsyncThunk(
  'application/getByOwner',
  async (data , { rejectWithValue , fulfillWithValue }) => {
    try {
      const response = await axios.post('/application/get-application-by-owner', { data });      
      return fulfillWithValue(response?.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getApplicationByDealer = createAsyncThunk(
  'application/getByDealer',
  async (data , { rejectWithValue , fulfillWithValue }) => {
    try {
      const response = await axios.post('/application/get-application-by-dealer', { data });      
      return fulfillWithValue(response?.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getApplicationByParty = createAsyncThunk(
  'application/getByParty',
  async (data , { rejectWithValue , fulfillWithValue }) => {
    try {
      const response = await axios.post('/application/get-application-by-party', { data });      
      return fulfillWithValue(response?.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getApplicationByBroker = createAsyncThunk(
  'application/getByBroker',
  async (data , { rejectWithValue , fulfillWithValue }) => {
    try {
      const response = await axios.post('/application/get-application-by-broker', { data });      
      return fulfillWithValue(response?.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


//Async thunk for new registartion of application
export const saveDocumentUpload = createAsyncThunk(
  'application/update',
  async ({id, data, files }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('data', JSON.stringify(data));
      // files: { [document_type_id]: File }
      if (files) {
        Object.entries(files).forEach(([docTypeId, file]) => {
          if (file) {
            formData.append(docTypeId, file);
          }
        });
      }
      const response = await axios.post('/application/document-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Upload Document failed');
    }
  }
);

// Async thunk for Work Done upload (per-service docs)
export const saveWorkDoneUpload = createAsyncThunk(
  'application/workDone',
  async ({ id, data, files }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('data', JSON.stringify(data));
      // files: { [service_id]: File }
      if (files) {
        Object.entries(files).forEach(([serviceId, file]) => {
          if (file) {
            formData.append(serviceId, file);
          }
        });
      }
      const response = await axios.post('/application/work-done', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return fulfillWithValue(response?.data);
    } catch (err) {
      
      return rejectWithValue(err.response?.data?.error || 'Save Work Done failed');
    }
  }
);

export const saveSendToRTOEntry = createAsyncThunk(
  'application/update',
  async ({ id, data }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post('/application/send-to-rto-entry', { id, data });
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Data Entry failed');
    }
  }
);

export const saveHsrpEntry = createAsyncThunk(
  'application/update',
  async ({ id, data }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post('/application/hsrp-entry', { id, data });
      return fulfillWithValue(response?.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Save Data Entry failed');
    }
  }
);

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    search: "",
    searchCols: "application_number,file_number ",
    include: "",
    exclude: "is_delete",
    application_id: null,
    currApplication: null,
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
    setApplicationId: (state, action) => {
      state.application_id = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
        state.data = [];
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload?.data || [];
        state.total = action.payload?.total || 0;
        state.page = action.payload?.page || 1;
        state.limit = action.payload?.pageSize || 10;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
      //Fetch Application By Id
      .addCase(fetchApplicationById.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currApplication = action.payload?.data || {};
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false; 
        state.error = action.payload;
      })
  },
});

export const { setPage, setLimit, setSearch, setSearchCols, setExclude, setInclude, setApplicationId } = applicationSlice.actions;
export default applicationSlice.reducer;
