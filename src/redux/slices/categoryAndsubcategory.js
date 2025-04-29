import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "https://apicxotv.techplusmedia.com";

const initialState = {
  data: [],
  isLoading: false,
  isError: false,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 25, // Assuming the default items per page
};

export const fetchNewscategoryAndsubcategory = createAsyncThunk(
  "categoryAndsubcategory/fetchNewscategoryAndsubcategory",
  async ({ nameParam, page }, { getState }) => {
    try {
      // Properly encode the parameter for URL usage
      const encodedName = encodeURIComponent(nameParam);

      console.log("Fetching with encoded name:", encodedName);

      const response = await axios.get(
        `${apiUrl}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=${encodedName}&filters[$or][1][subcategories].data[name][$eq]=${encodedName}&pagination[page]=${page}`
      );

      const { data, meta } = response.data;

      // Debug response data
      console.log("API Response:", response.data);
      console.log("Found items:", data.length);

      // Sort the data based on 'Date' first, then 'publishedAt' if 'Date' is null
      const sortedData = data.sort((a, b) => {
        const dateA = a.attributes.Date ? new Date(a.attributes.Date) : new Date(a.attributes.publishedAt);
        const dateB = b.attributes.Date ? new Date(b.attributes.Date) : new Date(b.attributes.publishedAt);
        return dateB - dateA;
      });

      return {
        data: sortedData,
        totalPages: meta.pagination.pageCount,
      };
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  }
);

const categoryAndsubcategoryNewsSlice = createSlice({
  name: "categoryAndsubcategoryNews",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewscategoryAndsubcategory.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchNewscategoryAndsubcategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.data = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchNewscategoryAndsubcategory.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setCurrentPage } = categoryAndsubcategoryNewsSlice.actions;

export default categoryAndsubcategoryNewsSlice.reducer;