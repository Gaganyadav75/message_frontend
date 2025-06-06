import { createAsyncThunk } from "@reduxjs/toolkit";
import { SignUpReturnInterface } from "../../../interfaces/utils";
import { BACKEND_URL_API } from "../../store";
import { LoginFormDataType } from "../../../components/sign/Login";
import { publish } from "../../../handlers/reusable/Event";


export const ResendEmail = createAsyncThunk<SignUpReturnInterface, LoginFormDataType, { rejectValue: string }>('auth/resend', async (data, thunkAPI) => {

    const dt = data;
      try {
        const response = await fetch(`${BACKEND_URL_API}/user/resend?id=${dt.id}&password=${dt.password}`, {
          method:"GET",
          credentials: 'include',
          headers: { 
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to resend');
        publish("changesigntab","signin")
        return data; // Assume this is in User format
      } catch (error) {
        publish("changesigntab","signin")
        return thunkAPI.rejectWithValue((error as Error).message);
      }
    });