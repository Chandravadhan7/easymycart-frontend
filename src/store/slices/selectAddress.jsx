import { createSlice } from "@reduxjs/toolkit";
import { setAddress } from "./addressSlice";

const initialState = null

 const displayAddress = createSlice({
    name : 'selectAddress',
    initialState,
    reducers:{
        setSelectedAddress(state,action){
            return action.payload
        }
    }
})

export const {setSelectedAddress} = displayAddress.actions;
export default displayAddress.reducer;