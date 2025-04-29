import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = "https://apicxotv.techplusmedia.com";

const initialState = {
  navbars: [],
  isLoading: false,
  isError: false,
};

export const fetchNavbars = createAsyncThunk('navbars/fetchNavbars', async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/navbars?populate[0]=list&populate[1]=list.image`);
    return response.data.data; // Assuming the response contains the data you need
  } catch (error) {
    throw error;
  }
});

const navbarsSlice = createSlice({
  name: 'navbars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavbars.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNavbars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.navbars = action.payload;
      })
      .addCase(fetchNavbars.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default navbarsSlice.reducer;
