import { createSlice } from "@reduxjs/toolkit";
import { GetChatApiCall } from "./getChats";
import AddChatsApiCall from "./addChats";
import toast from "react-hot-toast";
import { DeleteChatApiCall } from "./deleteChat";
import { BlockChatApiCall } from "./blockChat";
import { UnblockChatApiCall } from "./unBlockChat";
import { publish } from "../../../handlers/reusable/Event";


export type ContactType = {
  chatId:string;
  bio:string;
  email:string;
  profile:string;
  gender:string;
  isOnline:boolean;
  username:string;
  _id:string;
  isBlocked:boolean;
  blockedBy:string;
  isDeleted:string;
  unreadCount:null|number;
  updatedAt:number
}

interface ContactInterface{
  loading:boolean,
  error:null|string,
  current:ContactType|null,
  list:ContactType[],
}

const initialState:ContactInterface = {
    loading:true,
    error:null,
    current:null,
    list:[],
    
}

const Chats = createSlice({
    name:"chats",
    initialState,
    reducers:{
        setLoading:(state, action)=>{
          state.loading = action.payload;
        },
        addChats: (state,action) => {
          state.list = action.payload
          state.loading = false;
        },
        appendChat: (state,action) => {
          if (!state.list.some(ele=>ele._id==action.payload._id)) {
            state.list = [action.payload,...state.list]
            state.loading = false;
          }
        },
        updatedAt: (state,action) => {
          const list = state.list.map(ele=>{
            if (action.payload.chatId==ele.chatId) {
                ele.updatedAt = action.payload.updatedAt
            }
            return ele
          })
          state.list = list.sort((a,b)=>b.updatedAt-a.updatedAt) 
        },

        unReadUpdate: (state,action) => {
          state.list = state.list.map(ele=>{
            if (action.payload.chatId==ele.chatId) {
              if (action.payload.increment) {
                ele.unreadCount = action.payload.unreadCount + (ele.unreadCount||0)
              }else{
                ele.unreadCount = action.payload.unreadCount
              }
            }
            return ele
          })
        },
        updateCurrent: (state,action) => {
          state.current = action.payload
          publish('scroll-messages',true)
        },
        online_offline: (state,action) => {
          state.list = state.list.map(user=>{
            if (user.chatId==action.payload.chatId) {
              user.isOnline=action.payload.isOnline
            }
            return user
          })
          if (state.current && state.current?.chatId==action.payload.chatId) {
            state.current = {...state.current,isOnline:action.payload.isOnline}
          }
          state.loading = false
        },
        updateBlocked: (state,action) => {
          state.list = state.list.map(user=>{
            if (user.chatId==action.payload.chatId) {
              user.isBlocked=action.payload.isBlocked
              user.blockedBy=action.payload.blockedBy
            }
            return user
          })
          if (state.current && state.current?.chatId==action.payload.chatId) {
            state.current = {...state.current,...action.payload}
          }
          state.loading = false
        },

        deleteChat:(state,action)=>{
          state.list = state.list.filter(ele=>ele.chatId!=action.payload.chatId)
          if (state.current && state.current?.chatId==action.payload.chatId) {
            state.current = null
          }
          state.loading = false
        },
        deletedBy_contact:(state,action)=>{
          state.list = state.list.map(user=>{
            if (user.chatId==action.payload.chatId) {
              user = action.payload
            }
            return user
          })
          if (state.current && state.current?.chatId==action.payload.chatId) {
            state.current = action.payload
          }
          state.loading = false
        }
    },

    extraReducers:(builder)=>{
      builder
        .addCase(GetChatApiCall.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
        .addCase(GetChatApiCall.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.list = action.payload.chats;
          })
        .addCase(GetChatApiCall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
          })
        .addCase(AddChatsApiCall.pending, (state) => {
            state.error = null;
          })
        .addCase(AddChatsApiCall.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.list = [action.payload.contact,...state.list]
            state.current = action.payload.contact
          })
        .addCase(AddChatsApiCall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
            toast.error('contact add fail')
          })
        .addCase(DeleteChatApiCall.pending, (state) => {
            state.error = null;
          })
        .addCase(DeleteChatApiCall.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.list = state.list.filter(ele=>ele.chatId!=action.payload.contact.chatId)
            if (state.current && state.current?.chatId==action.payload.contact.chatId) {
              state.current = null
            }
          })
        .addCase(DeleteChatApiCall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
            toast.error('contact add fail')
          })
        .addCase(BlockChatApiCall.pending, (state) => {
            state.error = null;
          })
        .addCase(BlockChatApiCall.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.list = state.list.map(user=>{
              if (user.chatId==action.payload.contact.chatId) {
                user.isBlocked=true
                user.blockedBy=action.payload.contact.blockedBy
                user.profile = ''
              }
              return user
            })
            if (state.current && state.current?.chatId==action.payload.contact.chatId) {
              state.current  = {...action.payload.contact,profile:''}
            }
          })
        .addCase(BlockChatApiCall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
            toast.error('block fail')
          })
        .addCase(UnblockChatApiCall.pending, (state) => {
            state.error = null;
          })
        .addCase(UnblockChatApiCall.fulfilled, (state, action) => {
            state.loading = false;
            state.list = state.list.map(user=>{
              if (user.chatId==action.payload.contact.chatId) {
                user.isBlocked=false
                user.blockedBy=''
                user.profile = action.payload.contact.profile
              }
              return user
            })
            if (state.current && state.current?.chatId==action.payload.contact.chatId) {
              state.current  = {...action.payload.contact,isBlocked:false,blockedBy:''}
            }
          })
        .addCase(UnblockChatApiCall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
            toast.error('unblock failed')
          })
    }
    
})


export const {updatedAt,unReadUpdate, addChats ,updateCurrent, online_offline,setLoading,appendChat,updateBlocked,deleteChat,deletedBy_contact} = Chats.actions;
export default Chats.reducer;