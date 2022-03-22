import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  subscription: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setUserSubscription(state, action: PayloadAction<any>) {
      state.subscription = action.payload;
    },
  },
});

export const reducer = userSlice.reducer;
export const { setUser, setUserSubscription } = userSlice.actions;
