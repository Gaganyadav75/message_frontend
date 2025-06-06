import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContactType } from "./mainChats";
import { BACKEND_URL_API } from "../../store";

type addChatResponseType = {success:boolean,message:string,contact:ContactType};
type addChatType = {contact:ContactType};
// Async thunk actions for login and signup
 const AddChatsApiCall = createAsyncThunk<addChatResponseType,addChatType, { rejectValue: string }>('auth/addchats', async (contact, thunkAPI) => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/chat`, {
        method:"POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data; // Assume this is in User format
    } catch (error) {
      
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });


  export default  AddChatsApiCall