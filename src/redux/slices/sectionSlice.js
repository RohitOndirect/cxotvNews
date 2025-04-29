// src/redux/slices/sectionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "https://apicxotv.techplusmedia.com";

export const fetchLatestNewsByNames = createAsyncThunk(
  "news/fetchLatestNewsByNames",
  async (names, { rejectWithValue }) => {
    try {
      const responses = await Promise.all(
        names.map(async (name) => {
          // Fetch the latest news by category or subcategory name
          const response = await axios.get(
            `${apiUrl}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]=${name}&filters[$or][1][subcategories][name][$eq]=${name}&pagination[limit]=1`
          );

          return { name, news: response.data.data[0] || null };
        })
      );

      return responses;
    } catch (err) {
      console.log("Error fetching news:", err);
      return rejectWithValue(err.response.data);



    }
  }
);
const sectionSlice = createSlice({
  name: "SectionNews",
  initialState: {
    sectionNews: [], // Changed name here
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestNewsByNames.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLatestNewsByNames.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sectionNews = action.payload; // Changed name here
      })
      .addCase(fetchLatestNewsByNames.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export default sectionSlice.reducer;