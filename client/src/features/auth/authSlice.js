/**
 * Title: AuthSlice for Redux State Management

 * Date: 12, November 2023
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, { payload }) => {
      state.user = payload;
    },
    updateCart: (state, { payload }) => {
      if (state.user?.cart) {
        state.user.cart = payload; // Update the cart in the user object
      }
    },
  },
});

export const { addUser, updateCart } = authSlice.actions;
export default authSlice.reducer;
