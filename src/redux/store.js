import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"
import counterReducer from "./counterSlice"
import authReducer from "./authSlice"
import todoReducer from "./todolistSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    counter:counterReducer,
    auth:authReducer,
    todo:todoReducer
  },
});
