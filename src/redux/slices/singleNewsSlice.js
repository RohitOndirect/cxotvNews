import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl = "https://apicxotv.techplusmedia.com";

const initialState = {
  singleNewsItem: null,
  isLoading: false,
  isError: false,
};

export const fetchSingleNewsByTitle = createAsyncThunk(
  "singleNews/fetchByTitle",
  async ({ title }) => {

    try {
      const response = await axios.get(
        `${apiUrl}/api/news?populate=*&filters[slug][$eq]=${title}`
      );

      return response.data.data; // Return the first news item matching the title

    } catch (error) {
      throw error;
    }
  }
);

const singleNewsSlice = createSlice({
  name: "singleNews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleNewsByTitle.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSingleNewsByTitle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.singleNewsItem = action.payload;
      })
      .addCase(fetchSingleNewsByTitle.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.singleNewsItem = null;
      });
  },
});

export default singleNewsSlice.reducer;

