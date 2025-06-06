import { createAsyncThunk } from "@reduxjs/toolkit";
import { SignUpReturnInterface } from "../../../interfaces/utils";
import { loginResponseReturn } from "../../../interfaces/sign/login";
import { BACKEND_URL_API } from "../../store";

export const EmailVerify = createAsyncThunk<SignUpReturnInterface, string, { rejectValue: string }>('auth/verifyEmail', async (token, thunkAPI) => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/user/verify?token=${token}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data; // Assume this is in User format
    } catch (error) {
      console.log(error)
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });


export const AuthToken = createAsyncThunk<loginResponseReturn, void, { rejectValue: string }>('auth/token', async (_, thunkAPI) => {

      try {

        const response = await fetch(`${BACKEND_URL_API}/user/auth`, {
          method:"GET",
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to sign up');
        localStorage.setItem("logged","true");
        return data; // Assume this is in User format
      } catch (error) {
        localStorage.removeItem("logged");
        return thunkAPI.rejectWithValue((error as Error).message);
      }
    });