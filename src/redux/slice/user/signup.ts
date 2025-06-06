import { createAsyncThunk } from "@reduxjs/toolkit";
import { SignUpReturnInterface } from "../../../interfaces/utils";
import { SignUpDataInterFace } from "../../../interfaces/sign/signup";
import { validateField } from "../../../handlers/reusable/ValidateFeild";
import { BACKEND_URL_API } from "../../store";
import { publish } from "../../../handlers/reusable/Event";

export const signupUser = createAsyncThunk<SignUpReturnInterface, SignUpDataInterFace ,{ rejectValue: string }>(
    'auth/signupUser',
    async (formData, thunkAPI) => {
      const {username,email,password} = formData;
      try {
        const erruser = validateField("username",username );
        const erremail = validateField("email",email as string);
        const errpass = validateField("password",password as string);

        if (erruser || erremail || errpass) {
            return;
         }
        
        const response = await fetch(`${BACKEND_URL_API}/user/new`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
        },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to sign up');
        publish("changesigntab","verify")
        return data; // Assume this is in User format
      } catch (error) {
        return thunkAPI.rejectWithValue((error as Error).message);
      }
    }
  );