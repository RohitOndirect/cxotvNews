import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = "https://apicxotv.techplusmedia.com";
const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  try {
    const response = await axios.get(`https://apicxotv.techplusmedia.com/api/categories?populate[0]=subcategories&pagination[limit]=60`);
    return response.data.data; // Assuming the response contains the "data" field
  } catch (error) {
    throw error;
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default categoriesSlice.reducer;
