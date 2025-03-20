/**
 * Title: Write a program using JavaScript on FilterSlice

 * Date: 22, January 2024
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: null,
  brand: null,
  store: null,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
    setStore: (state, action) => {
      state.store = action.payload;
    },

    clearFilter: (state) => {
      state.category = null;
      state.brand = null;
      state.store = null;
    },
  },
});

export const { setCategory, setBrand, setStore, clearFilter } =
  filterSlice.actions;
export default filterSlice.reducer;
