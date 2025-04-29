import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = "https://apicxotv.techplusmedia.com";

export const fetchShortsUrl = createAsyncThunk(
  'youtube/fetchShortsUrl',
  async () => {
    const response = await axios.get(`${apiUrl}/api/shortss?populate=*&sort=publishedAt:DESC&pagination[limit]=1`);
    return response.data.data[0].attributes.ShortsUrl;
  }
);

const youtubeSlice = createSlice({
  name: 'youtube',
  initialState: {
    url: '',
    isLoading: false,
    isError: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShortsUrl.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchShortsUrl.fulfilled, (state, action) => {
        state.url = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchShortsUrl.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  }
});

export default youtubeSlice.reducer;

