import { createSlice } from "@reduxjs/toolkit";

let initialState = [];
const recentViewedSlice = createSlice({
    name:'recent',
    initialState,
    reducers:{
        setRecent(state,action){
            return action.payload;
        }
    }
})

export const {setRecent} = recentViewedSlice.actions;
export default recentViewedSlice.reducer;