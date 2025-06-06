import { createSlice } from "@reduxjs/toolkit";
import { publish } from "../../../handlers/reusable/Event";


type TabState = {
    darkmode: boolean,
    currentTab:"chats" |"calls" | "settings" |"profile"|'signin'|'signup',
    signTab:"signin" | "signup" | "forgot" | "resend" | "verify",
}

const initialState:TabState = {
    darkmode:localStorage.getItem('dark')=='false'?false:true,
    currentTab:"chats",
    signTab:"signin",
}

const Tabs = createSlice({
    name:"tabs",
    initialState,
    reducers:{
        setDarkmode:(state,action)=>{
          state.darkmode = action.payload;
          localStorage.setItem('dark',action.payload)
        },
        ChangeTab: (state,action) => {
          publish('scroll-messages',true)
          state.currentTab = action.payload
        },
        ChangeSignTab: (state,action) => {
          state.signTab = action.payload
        },
    }
    
})


export const { ChangeTab ,ChangeSignTab,setDarkmode} = Tabs.actions;
export default Tabs.reducer;