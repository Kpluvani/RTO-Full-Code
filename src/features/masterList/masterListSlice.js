import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosConfig';

// Async thunk for get Maker Model
export const fetchMasterList = createAsyncThunk(
  'maker-model/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/masters/all');
      console.log('<<resposnse===', response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Fetch Maker Models Failed');
    }
  }
);

const MasterListSlice = createSlice({
  name: 'master-list',
  initialState: {
    makers: [],
    makerModels: [],
    dealers: [],
    parties: [],
    brokers: [],
    vehicleTypes: [],
    vehicleClasses: [],
    fuels: [],
    noms: [],
    vehicleBodyTypes: [],
    rtos: [],
    registrationTypes: [],
    ownershipTypes: [],
    ownerCategories: [],
    states: [],
    districts: [],
    vehicleCategories: [],
    purchaseAses: [],
    insuranceCompanies: [],
    insuranceTypes: [],
    holdReasons: [],
    years: [],
    months: [],
    manufactureLocations: [],
    financers: [],
    status: 'idle',
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasterList.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMasterList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log('<<<masters---', action.payload);
        state.makers = action.payload?.makers || [];
        state.makerModels = action.payload?.makerModels || [];
        state.dealers = action.payload?.dealers || [];
        state.parties = action.payload?.parties || [];
        state.brokers = action.payload?.brokers || [];
        state.vehicleTypes = action.payload?.vehicleTypes || [];
        state.vehicleClasses = action.payload?.vehicleClasses || [];
        state.fuels = action.payload?.fuels || [];
        state.noms = action.payload?.noms || [];
        state.vehicleBodyTypes = action.payload?.vehicleBodyTypes || [];
        state.rtos = action.payload?.rtos || [];
        state.registrationTypes = action.payload?.registrationTypes || [];
        state.ownershipTypes = action.payload?.ownershipTypes || [];
        state.ownerCategories = action.payload?.ownerCategories || [];
        state.states = action.payload?.states || [];
        state.districts = action.payload?.districts || [];
        state.vehicleCategories = action.payload?.vehicleCategories || [];
        state.purchaseAses = action.payload?.purchaseAses || [];
        state.insuranceCompanies = action.payload?.insuranceCompanies || [];
        state.insuranceTypes = action.payload?.insuranceTypes || [];
        state.holdReasons = action.payload?.holdReasons || [];
        state.years = action.payload?.years || [];
        state.months = action.payload?.months || [];
        state.financers = action.payload?.financers || [];
        state.manufactureLocations = action.payload?.manufactureLocations || [];
      })
      .addCase(fetchMasterList.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
  },
});


export const {  } = MasterListSlice.actions;
export default MasterListSlice.reducer;
