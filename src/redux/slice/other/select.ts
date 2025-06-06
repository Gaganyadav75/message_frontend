import { createSlice } from "@reduxjs/toolkit";
import { EachMessageTypes } from "../message/mainMessage";


type SelectedType = {
    messages:EachMessageTypes[],
    forward:boolean;
}

const initialState:SelectedType = {
    messages:[],
    forward:false
}

const Select = createSlice({
    name:"select",
    initialState,
    reducers:{
        AddtoSelectedMessage: (state,action) => {
            if(!(state.messages.some(ele=>ele._id==action.payload._id))){
                state.messages = [...state.messages,action.payload]
            }
        },
        RemoveFromSelectedMessage: (state,action) => {
            state.messages = state.messages.filter(ele=>ele._id!=action.payload._id)
        },
        ResetSelectedMessage: (state) => {
            state.messages = []
        },
        setForward: (state,action) => {
            state.forward = action.payload
        },
    }
    
})


export const { AddtoSelectedMessage,RemoveFromSelectedMessage,ResetSelectedMessage,setForward } = Select.actions;
export default Select.reducer;