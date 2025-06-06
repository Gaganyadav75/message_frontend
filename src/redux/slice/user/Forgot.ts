import { createAsyncThunk } from "@reduxjs/toolkit";
import {  loginResponseReturn } from "../../../interfaces/sign/login";
import { BACKEND_URL_API } from "../../store";


export const ForgotSendCode = createAsyncThunk<loginResponseReturn, string, { rejectValue: string }>('auth/forgotsendcode', async (email, thunkAPI) => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/user/forgot?email=${email}`, {
        method:"GET",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data; 
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });

  type VerifyPayloadType = {
email?:string,
otp?:string|number,
password?:string,
  }


export const ForgotVerifyCode = createAsyncThunk<loginResponseReturn, VerifyPayloadType, { rejectValue: string }>('auth/forgotverifycode', async (userdata, thunkAPI) => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/user/forgot`, {
        method:"POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userdata),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });

