import { createSlice } from "@reduxjs/toolkit";

const data = localStorage.getItem("item");
let initialState = { items: [] };

try {
  if (data) {
    const parsed = JSON.parse(data);
    // agar parsed array nahi hai to empty array de do
    initialState = { items: Array.isArray(parsed) ? parsed : [] };
  }
} catch (error) {
  console.error("Invalid todo data in localStorage", error);
}

const todolistSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    add: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem("item", JSON.stringify(state.items)); 
    },
    remove: (state, action) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
      localStorage.setItem("item", JSON.stringify(state.items));
    },
  },
});

export const { add, remove } = todolistSlice.actions;
export default todolistSlice.reducer;
