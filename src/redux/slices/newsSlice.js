import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "https://apicxotv.techplusmedia.com";

const initialState = {
  data: {},
  isLoading: false,
  isError: false,
};

export const fetchNewsByName = createAsyncThunk(
  'news/fetchByName',
  async ({ nameParam }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/news?populate=*&filters[$or][0][categories].data[name][$eq]=${nameParam}&filters[$or][1][subcategories].data[name][$eq]=${nameParam}&sort=publishedAt:DESC`
      );

      const data = response.data.data;

      // Sort the data based on 'Date' first, then 'publishedAt' if 'Date' is null
      const sortedData = data.sort((a, b) => {
        const dateA = a.attributes.Date ? new Date(a.attributes.Date) : new Date(a.attributes.publishedAt);
        const dateB = b.attributes.Date ? new Date(b.attributes.Date) : new Date(b.attributes.publishedAt);
        return dateB - dateA; // Descending order
      });

      return { nameParam, data: sortedData };
    } catch (error) {
      console.error('Error fetching news data:', error);
      return rejectWithValue(error.message);
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsByName.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNewsByName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        const { nameParam, data } = action.payload;
        state.data[nameParam] = data;
      })
      .addCase(fetchNewsByName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        console.error('Fetch rejected with error:', action.payload);
      });
  },
});

export default newsSlice.reducer;
