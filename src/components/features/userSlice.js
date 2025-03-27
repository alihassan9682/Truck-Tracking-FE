import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: false,
  userData: {},
  isLoading: false,
  googleAccessToken: null,
  id: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    setuserData: (state, action) => {
      state.userData = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setGoogleAccessToken: (state, action) => {
      state.googleAccessToken = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
  },
});
export const {
  setuserData,
  setAuth,
  setIsLoading,
  setGoogleAccessToken,
  setId,
} = userSlice.actions;

export default userSlice.reducer;
