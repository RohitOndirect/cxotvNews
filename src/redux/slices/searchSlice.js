import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const apiUrl1 = "https://apicxotv.techplusmedia.com";


// Utility function to safely access sessionStorage
const getSessionStorageItem = (key, defaultValue) => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

// Define initial state
const initialState = {
  searchTerm: getSessionStorageItem("searchTerm", ""), // Safely access sessionStorage
  searchResults: [],
  status: "idle",
  error: null,
};

const REACT_APP_UPLOAD_URL = "https://apicxotv.techplusmedia.com";
const Url = REACT_APP_UPLOAD_URL;

export const fetchSearchResults = createAsyncThunk(
  "search/fetchSearchResults",
  async (searchTerm, { rejectWithValue }) => {
    try {
      // Split search term into words and encode each part
      const searchTerms = searchTerm
        .trim()
        .split(" ")
        .map((term) => encodeURIComponent(term.toLowerCase())); // Convert to lowercase

      // Construct API URL to filter by slugs containing all parts of search terms
      const apiUrl = `${apiUrl1}/api/news?filters[slug][$containsi]=${searchTerms.join(
        "&filters[slug][$containsi]="
      )}&populate=*&pagination[limit]=90&sort=publishedAt:DESC`;

      const response = await axios.get(apiUrl);

      // Sort results by relevance (number of matched words)
      const sortedResults = response.data.data.sort((a, b) => {
        const slugA = a.attributes.slug.toLowerCase();
        const slugB = b.attributes.slug.toLowerCase();
        const matchCountA = searchTerms.filter((term) => slugA.includes(term)).length;
        const matchCountB = searchTerms.filter((term) => slugB.includes(term)).length;
        return matchCountB - matchCountA;
      });

      return sortedResults; // Return the sorted array of search results
    } catch (error) {
      console.error("Error fetching data:", error); // Log error if fetching fails
      return rejectWithValue(error.message); // Reject with error message
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      const searchTerm = action.payload;
      state.searchTerm = searchTerm;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("searchTerm", searchTerm); // Safely set sessionStorage
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.status = "loading";
        state.searchResults = []; // Clear previous search results on pending
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchResults = action.payload; // Update search results on success
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Update error state on failure
      });
  },
});

export const { setSearchTerm } = searchSlice.actions;

export default searchSlice.reducer;