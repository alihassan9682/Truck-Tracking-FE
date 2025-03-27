import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses local storage
import thunk from "redux-thunk";
import { userSlice } from "../components/features/userSlice";
import reducer from "./reducer";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

// Wrap your main reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, reducer);
const userPersisted = persistReducer(persistConfig, userSlice.reducer);
const store = configureStore({
  reducer: {
    reducer: persistedReducer,
    user: userPersisted, // Persisted user slice
  },
  middleware: [thunk], // Apply middleware
});

const persistor = persistStore(store); // Create a persistor

export { store, persistor };
