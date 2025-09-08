import { createSlice } from "@reduxjs/toolkit";

const storedData = localStorage.getItem("cart");

let initialState = { items: [] };

try {
  if (storedData) {
    initialState = { items: JSON.parse(storedData) }; // hamesha array banayega
  }
} catch (error) {
  console.error("Invalid cart data in localStorage", error);
}

const cartSlice = createSlice({
  name:"cart",
  initialState,
  reducers:{
 addToCart: (state, action) => {
  const newItem = { ...action.payload, quantity: action.payload.quantity || 1 };
  state.items.push(newItem);
 localStorage.setItem("cart", JSON.stringify(state.items));
},

  clearCart:(state)=>{
    state.items= []
  },
 removeFromCart: (state, action) => {
  state.items = state.items.filter(item => item.id !== action.payload);
  localStorage.setItem("cart", JSON.stringify(state.items));
},
 increaseQuantity: (state, action) => {
 const food = state.items.find(item => item.id == action.payload);
 if(food){
    food.quantity +=1
 }
 localStorage.setItem("cart", JSON.stringify(state.items));
},
 decreaseQuantity: (state, action) => {
 const food = state.items.find(item => item.id == action.payload);
 if(food && food.quantity>1){
    food.quantity -=1
 }
 localStorage.setItem("cart", JSON.stringify(state.items));
}

  }
  
})
export const {addToCart,clearCart,removeFromCart,increaseQuantity,decreaseQuantity} = cartSlice.actions
export default cartSlice.reducer