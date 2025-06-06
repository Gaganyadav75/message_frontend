import { createAsyncThunk } from "@reduxjs/toolkit";
import { EachMessageTypes } from "./mainMessage";
import { ContactType } from "../chat/mainChats";
import { BACKEND_URL_API } from "../../store";


type getMessageResponseType = {success:boolean,message:string,contact:ContactType,messages:EachMessageTypes[],scroll:boolean}
// Async thunk actions for login and signup
type Data = {contact:ContactType|null,last:number|Date,limit:number}
export const GetMessagesApiCall = createAsyncThunk<getMessageResponseType,Data, { rejectValue: string }>('auth/getmessages', async (Parameter, thunkAPI) => {

 
    try {
        const response = await fetch(`${BACKEND_URL_API}/message?last=${String(Number(new Date(Parameter.last)))}&limit=${Parameter.limit}`, {
        method:"POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({contact:Parameter.contact})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data; // Assume this is in User format
    } catch (error) {
      
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });