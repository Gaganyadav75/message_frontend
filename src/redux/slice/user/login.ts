import { createAsyncThunk } from "@reduxjs/toolkit";
import {  loginResponseReturn } from "../../../interfaces/sign/login";
import { BACKEND_URL_API } from "../../store";
import { LoginFormDataType } from "../../../components/sign/Login";


export const loginUser = createAsyncThunk<loginResponseReturn, LoginFormDataType, { rejectValue: string }>('auth/loginUser', async (userData, thunkAPI) => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/user`, {
        method:"POST",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      localStorage.setItem("logged","true")
      return data; // Assume this is in User format
    } catch (error) {
      localStorage.removeItem("logged")
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });