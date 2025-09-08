import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name:"counter",
    initialState:{value:0},
    reducers:{
        addnumber:(state)=>{
          state.value +=1
        },
        subtarctnumber:(state)=>{
            if(state.value > 0){
               state.value -=1
            }
           
        }
    }

})
export const {addnumber,subtarctnumber}= counterSlice.actions
export default counterSlice.reducer;