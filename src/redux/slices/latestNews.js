import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "https://apicxotv.techplusmedia.com";

// Create an async thunk for fetching the latest news
export const fetchLatestNews = createAsyncThunk(
  "latestNews/fetchLatestNews",
  async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/news?populate=*&sort=publishedAt:DESC&pagination[limit]=30`
      );

      const data = response.data.data;

      // Sort the data based on 'Date' first, then 'publishedAt' if 'Date' is null
      const sortedData = data.sort((a, b) => {
        const dateA = a.attributes.Date ? new Date(a.attributes.Date) : new Date(a.attributes.publishedAt);
        const dateB = b.attributes.Date ? new Date(b.attributes.Date) : new Date(b.attributes.publishedAt);
        return dateB - dateA; // Descending order
      });

      return sortedData;
    } catch (error) {
      throw error;
    }
  }
);

const latestNewsSlice = createSlice({
  name: "latestNews",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestNews.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchLatestNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default latestNewsSlice.reducer;
