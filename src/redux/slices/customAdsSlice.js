import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = "https://apicxotv.techplusmedia.com";

const initialState = {
  AdData: [],
  isAdLoading: false,
  isError: false,
};

export const fetchCustomAds = createAsyncThunk('customAds/fetchCustomAds', async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/costom-ads?populate=image`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
});

const customAdsSlice = createSlice({
  name: 'customAds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomAds.pending, (state) => {
        state.isAdLoading = true;
        state.isError = false;
      })
      .addCase(fetchCustomAds.fulfilled, (state, action) => {
        state.isAdLoading = false;
        state.isError = false;
        state.AdData = action.payload;
      })
      .addCase(fetchCustomAds.rejected, (state) => {
        state.isAdLoading = false;
        state.isError = true;
      });
  },
});

export default customAdsSlice.reducer;
