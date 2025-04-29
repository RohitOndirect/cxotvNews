import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "https://apicxotv.techplusmedia.com";

// Define the initial state to store news data as an array
const initialState = {
  data: [], // Store news data as an array
  isLoading: false,
  isError: false,
};

// Define the async thunk to fetch news data by category name
export const fetchSpecificCategorySlice = createAsyncThunk(
  "categoryAndsubcategory/fetchSpecificCategorySlice",
  async ({ nameParam }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=${nameParam}&filters[$or][1][subcategories][name][$eq]=${nameParam}&pagination[limit]=20`
      );

      const newsData = response.data.data;

      // Sort the news data based on 'Date' first, then 'publishedAt' if 'Date' is null
      const sortedNewsData = newsData.sort((a, b) => {
        const dateA = a.attributes.Date ? new Date(a.attributes.Date) : new Date(a.attributes.publishedAt);
        const dateB = b.attributes.Date ? new Date(b.attributes.Date) : new Date(b.attributes.publishedAt);
        return dateB - dateA; // Descending order
      });

      return sortedNewsData;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the news slice
const specificCategorySlice = createSlice({
  name: "specificCategoryNews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecificCategorySlice.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchSpecificCategorySlice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(fetchSpecificCategorySlice.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default specificCategorySlice.reducer;
