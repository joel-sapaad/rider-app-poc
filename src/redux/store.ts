import { configureStore } from "@reduxjs/toolkit";
import { loadState, saveState } from "../localStorage";
import * as reducers from "./features";
const persistedState = loadState();
export const store = configureStore({
  reducer: reducers,
  preloadedState: persistedState
});

store.subscribe(() => {
  saveState({
    user: store.getState().user,
  });
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
