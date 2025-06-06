import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContactType } from "./mainChats";
import { BACKEND_URL_API } from "../../store";

type getChatResponseType = {success:boolean,message:string,chats:ContactType[]}
// Async thunk actions for login and signup
export const GetChatApiCall = createAsyncThunk<getChatResponseType,undefined, { rejectValue: string }>('auth/getchats', async (userData, thunkAPI) => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/chat`, {
        method:"GET",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data; // Assume this is in User format
    } catch (error) {
      
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });