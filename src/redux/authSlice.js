import { createSlice } from "@reduxjs/toolkit";

const authinfo = localStorage.getItem("auth")

const initialState= authinfo? JSON.parse(authinfo):

{
   
    user:null,
    token:null,
}


const authSlice = createSlice ({
name:"auth",
initialState,
reducers:{
 setUser:(state,action)=>{
   state.token= action.payload.token,
   state.user = action.payload.user,
   localStorage.setItem("auth",JSON.stringify(action.payload))
 },
 removeUser:(state)=>{
  state.token= null,
  state.user= null
 }


}
})

export const {removeUser,setUser} = authSlice.actions
export default authSlice.reducer