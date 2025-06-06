import { createAsyncThunk } from "@reduxjs/toolkit";
import {  loginResponseReturn } from "../../../interfaces/sign/login";
import { BACKEND_URL_API } from "../../store";

export const logoutUser = createAsyncThunk<loginResponseReturn, void, { rejectValue: string }>('auth/logoutUser', 
    async (_, thunkAPI) => {
    try {
      const response = await fetch(`${BACKEND_URL_API}/user`, {
        method:"DELETE",
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to sign up');
      localStorage.removeItem("logged");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  });