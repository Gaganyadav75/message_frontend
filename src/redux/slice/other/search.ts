import { createSlice } from "@reduxjs/toolkit";
import { EachMessageTypes } from "../message/mainMessage";


type SearchType = {
    messages:EachMessageTypes[],
    search:boolean;
    current:null|EachMessageTypes
    query:string
    currentIndex:number
}

const initialState:SearchType = {
    messages:[],
    search:false,
    current:null,
    currentIndex:0,
    query:''
}

const Search = createSlice({
    name:"search",
    initialState,
    reducers:{
        setSearchQuery:(state,action)=>{
            state.query = action.payload
        },
        setSearchMessage: (state,action) => {
            state.messages = action.payload
            state.current = action.payload[0]
        },
        setSearch: (state,action) => {
            state.search = action.payload
        },
        resetSearch: (state) => {
            state.search = false;
            state.current = null;
            state.messages = []
            state.query = ''
        },
        resetButDontShutSerachComponent: (state) => {
            state.current = null;
            state.messages = []
            state.query = ''
        },
        ChangeSearchCurrent: (state,action) => {
            const length = state.messages.length
            const currind = state.messages.findIndex(value=>value._id==state.current?._id)||0
            if (action.payload) {
                if (currind<length-1) {
                    state.current = state.messages[currind+1]  
                    state.currentIndex = currind+1
                }
            }else{
                if (currind>0) {
                    state.current = state.messages[currind-1]  
                    state.currentIndex = currind-1 
                }
            }
        },
    }
    
})


export const { setSearchMessage,setSearch,resetSearch ,ChangeSearchCurrent,setSearchQuery,resetButDontShutSerachComponent} = Search.actions;
export default Search.reducer;