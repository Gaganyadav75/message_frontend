import { createAsyncThunk } from "@reduxjs/toolkit";
import { SignUpReturnInterface } from "../../../interfaces/utils";
import { BACKEND_URL_API } from "../../store";

export type BioUpdateReturnType = {
  bio: string;
  success: boolean;
  message: string;
}


export const UpdateProfile = createAsyncThunk<SignUpReturnInterface, File, {rejectValue: string }>('auth/updateprofile', async (profile, thunkAPI) => {
    try {
        const formData = new FormData()
        formData.append("profile",profile)

        const response = await fetch(`${BACKEND_URL_API}/user/profile`, {
            method:"POST",
            credentials: 'include',
            body: formData,
        });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data; // Assume this is in User format
    } catch (error) {
      
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });


export type UpdateDataType = {
  bio?:string;
  email?:string;
  username?:string;
  success?: boolean;
  message?: string;
}
export type UpdateDataReturnType = {
  data:{bio?:string;
  email?:string;
  username?:string;}
  success?: boolean;
  message?: string;
}

export const UpdateUserData = createAsyncThunk<UpdateDataReturnType, UpdateDataType, {rejectValue: string }>('auth/updatebio', async (updatedata, thunkAPI) => {
    try {
        const response = await fetch(`${BACKEND_URL_API}/user/update`, {
            method:"POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedata),
        });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data; 
    } catch (error) {
      
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });