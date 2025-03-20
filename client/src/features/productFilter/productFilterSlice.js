/**
 * Title: Write a program using JavaScript on ProductFilterSlice

 * Date: 14, November 2023
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterCredentials: {},
};

const productFilter = createSlice({
  name: "productFilter",
  initialState,
  reducers: {
    addProductFilter: (state, { payload }) => {
      const [filterType, filterItems] = payload;
      state.filterCredentials = {
        ...state.filterCredentials,
        [filterType]: filterItems,
      };
    },

    clearProductFilter: (state) => {
      state.filterCredentials = {};
    },
  },
});

export const { addProductFilter, clearProductFilter } = productFilter.actions;
export default productFilter.reducer;
