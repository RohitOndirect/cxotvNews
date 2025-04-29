import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "https://apicxotv.techplusmedia.com";

// Define the initial state to store news data as an array
const initialState = {
  data: {
    APAC: [],
    EMEA: [],
    INDIA: [],
    USA: [],
    "Trending News": [],
  },
  isLoading: false,
  isError: false,
};

// Define the async thunk to fetch news data by category name
export const fetchRegionNews = createAsyncThunk(
  "regionNews/fetchRegionNews",
  async (region, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=${region}&filters[$or][1][subcategories][name][$eq]=${region}&pagination[limit]=20`
      );

      // Sort the data based on 'Date' first, then 'publishedAt' if 'Date' is null
      const sortedData = response.data.data.sort((a, b) => {
        const dateA = a.attributes.Date ? new Date(a.attributes.Date) : new Date(a.attributes.publishedAt);
        const dateB = b.attributes.Date ? new Date(b.attributes.Date) : new Date(b.attributes.publishedAt);
        return dateB - dateA; // Descending order
      });

      return { region, data: sortedData };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the region news slice
const regionNewsSlice = createSlice({
  name: "regionNews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegionNews.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchRegionNews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data[action.payload.region] = action.payload.data;
      })
      .addCase(fetchRegionNews.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default regionNewsSlice.reducer;
