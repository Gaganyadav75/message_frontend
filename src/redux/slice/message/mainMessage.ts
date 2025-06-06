import { createSlice } from "@reduxjs/toolkit";
import { GetMessagesApiCall } from "./getMessages";

export type EachMessageTypes = {
    text:string,
    type:string
    deleted:boolean
    sender:string
    time:Date
    _id:string
    attach?:string|null
    status:'sent'|'unread'|'read'
}

export type ListOfMessageType = {
    chatId:string,
    messages:EachMessageTypes[],
    hasmore:boolean,
    last:number,
}

interface MessageStoreType{
  loading:boolean,
  scrollIt:boolean,
  error:null|string,
  list:ListOfMessageType[],
}

const initialState:MessageStoreType = {
    loading:false,
    error:null,
    scrollIt:false,
    list:[],
}

const Messages = createSlice({
    name:"message",
    initialState,
    reducers:{
        sendMessage:(state,action)=>{
            const chatExist = state.list.some(chat=>chat.chatId==action.payload.chatId)
            if (chatExist) {
                state.list = state.list.map(chat=>{
                    if (chat.chatId==action.payload.chatId) {
                        if (chat.messages.length>0) {
                            chat.messages = [...chat.messages,...action.payload.messages]
                        }else{
                            chat.messages = action.payload.messages
                        }
                        state.scrollIt = true
                    }
                    return chat
                })
            }

        },

        updateCallMessage:(state,action)=>{
            const chatExist = state.list.some(chat=>chat.chatId==action.payload.chatId)
            if (chatExist) {
                state.list = state.list.map(chat=>{
                    if (chat.chatId==action.payload.chatId) {
                        if (chat.messages.length>0) {
                            chat.messages = chat.messages.map(ele=>{
                                if(ele._id==action.payload.messageId){
                                    ele={...ele,...action.payload}
                                }
                                return ele
                            })
                        } 
                    }
                    return chat
                })
            }

        },

        addMessagesInList: (state,action) => {
            const chatExist = state.list.some(chat=>chat.chatId==action.payload.chatId)
            const last = action.payload.messages.length>0?Number(new Date(action.payload.messages[0].time)):0;
            if (chatExist){
             state.list = state.list.map(mess=>{
                if (mess.chatId==action.payload.chatId) {
                        if (mess.messages?.length>0) {
                            mess.messages = [...action.payload.messages,...mess.messages]
                        }else{
                            mess.messages = action.payload.messages
                        }
                        mess.last = last
                }
                return mess;
              })

            }else{
                state.list = [...state.list,{last,...action.payload}];
            }
          },

        updateScrollIt:(state,action)=>{
            state.scrollIt = action.payload
        },

        messageSeen:(state,action) =>{
            const chatExist = state.list.some(chat=>chat.chatId==action.payload)
            if (chatExist) {
                state.list = state.list.map(ele=>{
                    if (ele.chatId==action.payload) {
                        ele.messages = ele.messages.map(mess=>{mess.status = 'read';return mess})
                    }
                    return ele
                })
            }
        },

        deleteMessage: (state,action) => {
            const chatExist = state.list.some(chat=>chat.chatId==action.payload.chatId)
            if (chatExist){
             state.list = state.list.map(mess=>{
                if (mess.chatId==action.payload.chatId) {
                    mess.messages = mess.messages.filter(mes=>{

                        if (mes._id ==action.payload.messageId) {
                            if (!mes.deleted) {
                            mes.text = 'deleted';
                            mes.type = 'text';
                            mes.attach = '';
                            mes.deleted = true;
                            }else{
                                return null;
                            }
                        }
                        return mes;
                    });
                }
                return mess;
              })
            }
          
        },
        updateAttachment: (state,action) => {
            const chatExist = state.list.some(chat=>chat.chatId==action.payload.chatId)
            if (chatExist){
             state.list = state.list.map(mess=>{
                if (mess.chatId==action.payload.chatId) {
                    mess.messages = mess.messages.map(mes=>{
                        if (mes._id ==action.payload.messageId) {
                            mes.attach = action.payload.attach;
                        }
                        return mes;
                    });
                }
                return mess;
              })
            }
          
        }
    },

    extraReducers:(builder) =>{
        builder
            .addCase(GetMessagesApiCall.pending, (state) => {
                state.loading = true;
                state.error = null;
                })
            .addCase(GetMessagesApiCall.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
               
                const chatExist = state.list.some(chat=>chat.chatId==action.payload.contact.chatId)
                const last = action.payload.messages.length>0?Number(new Date(action.payload.messages[0].time)):0;
                if (chatExist){
                state.list = state.list.map(mess=>{
                    if (mess.chatId==action.payload.contact.chatId) {
                            if (mess.messages?.length>0) {
                                mess.messages = [...action.payload.messages,...mess.messages]
                            }else{
                                mess.messages = action.payload.messages
                            }
                            if (action.payload.messages?.length<=0) {
                                mess.hasmore = false
                            }
                        mess.last = last
                    }
                    return mess;
                })
                }else{
                    state.list = [...state.list,{chatId:action.payload.contact.chatId,hasmore:true,messages:action.payload.messages,last}];
                    state.scrollIt = true
                }
              })
            .addCase(GetMessagesApiCall.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
              })






    }

    
})


export const {messageSeen , addMessagesInList,sendMessage,deleteMessage,updateScrollIt,updateAttachment,updateCallMessage} = Messages.actions;
export default Messages.reducer;