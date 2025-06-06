// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignUpReturnInterface } from '../../../interfaces/utils';
import {  loginResponseReturn } from '../../../interfaces/sign/login';
import Cookies from "js-cookie";
import { ResendEmail } from './resend';
import { signupUser } from './signup';
import { loginUser } from './login';
import { AuthToken, EmailVerify } from './verify';
import {   UpdateDataReturnType,  UpdateProfile, UpdateUserData } from './update';
import { logoutUser } from './logout';
import { navigate } from '../../../pages/main/Application';
import { ForgotSendCode, ForgotVerifyCode } from './Forgot';


export type UserStateInAuth = {
  _id: string;
  username: string;
  email: string;
  bio: string;
  gender: string;
  profile: string;
}


interface AuthState {
  user: UserStateInAuth | null;
  loading: boolean;
  error: null | string;
  success:null | string,
  verified:boolean;
  forgot:null|'sent'|'verified',
  logout:boolean,
  update:null | 'email'| 'username' | 'bio' | 'profile',
  updateloading:boolean,
}


const initialState: AuthState = {
  user:null,
  verified:false,
  loading: false,
  update: null,
  updateloading: false,
  error: null,
  success:null,
  logout:false,
  forgot:null,
};




const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    ResetSucessError:(state)=>{
      state.error = null;
      state.success = null;
      state.forgot = null;
    },
    SetCurrentUpdate:(state,action)=>{
     state.update = action.payload
    },
    SetForgot:(state,action)=>{
      state.forgot = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(ForgotVerifyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(ForgotVerifyCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = (action.payload.message).toString() || "profile added successfully ";
        state.user = null;
        state.forgot="verified";
      })
      .addCase(ForgotVerifyCode.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.forgot = null;
        state.error = action.payload?.toString() || 'Failed to send code';
      })
      .addCase(ForgotSendCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(ForgotSendCode.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = (action.payload.message).toString() || "profile added successfully ";
        state.user = null;
        state.forgot="sent";
      })
      .addCase(ForgotSendCode.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload?.toString()|| 'Failed to send code';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = (action.payload.message).toString() || "profile added successfully ";
        state.user = null;
        state.logout = true
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
      })
      .addCase(UpdateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(UpdateProfile.fulfilled, (state, action: PayloadAction<SignUpReturnInterface>) => {
        state.loading = false;
        state.error = null;
        state.success = (action.payload.message).toString() || "profile added successfully ";
        state.user = {...state.user,...action.payload.user}
      })
      .addCase(UpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload?.toString().split(":")[1] || 'Failed to sign up';
      })
      .addCase(ResendEmail.pending, (state) => {
        state.loading = true;
        state.success = null;
      })
      .addCase(ResendEmail.fulfilled, (state, action: PayloadAction<SignUpReturnInterface>) => {
        state.loading = false;
        state.error = null;
        state.success = (action.payload.message).toString() || "verification mail resended successfully ";
      })
      .addCase(ResendEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload?.toString()|| 'Failed to sign up';
        Cookies.remove("token");
      })
      .addCase(AuthToken.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(AuthToken.fulfilled, (state, action: PayloadAction<loginResponseReturn>) => {
        state.loading = false;
        state.error = null;
        state.success = action.payload.message;
        if (state.user && state.user._id!=action.payload.user._id) {
          state.user = null
          localStorage.removeItem('user')
          return
        }
        state.user = action.payload.user;
        sessionStorage.setItem('user',JSON.stringify(action.payload.user))
      })
      .addCase(AuthToken.rejected, (state) => {
        state.loading = false;
        state.success = null;
        state.error = "Authentication failed";
        console.log("auth Token Error")
        sessionStorage.removeItem('user')
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<SignUpReturnInterface>) => {
        state.loading = false;
        state.error = null;
        state.success = (action.payload.message).toString();
        
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload?.toString() || 'Failed to sign up';
  
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<loginResponseReturn>) => {
        state.loading = false;
        state.success = action.payload.message;
        state.user = action.payload.user;
        localStorage.setItem('user',JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload|| 'Failed to sign up';
        localStorage.removeItem('user')
      })
      .addCase(EmailVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(EmailVerify.fulfilled, (state, action: PayloadAction<SignUpReturnInterface>) => {
        state.loading = false;
        state.success = action.payload.message;
        navigate('/',action.payload.message||'verified successfully')
      })
      .addCase(EmailVerify.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        state.error = action.payload|| 'Failed to verify email';
        navigate('/',action.payload||'Failed to verify email')
      })
      .addCase(UpdateUserData.pending, (state) => {
        state.error = null;
        state.success = null;
        state.updateloading = true;
      })
      .addCase(UpdateUserData.fulfilled, (state, action: PayloadAction<UpdateDataReturnType>) => {
        if (state.user) {
          state.user = {...state.user,...action.payload.data}
        }
        state.success = null;
        state.updateloading = false;
        state.update = null;
      })
      .addCase(UpdateUserData.rejected, (state, action) => {
        state.updateloading = false;
        state.success = null;
        state.error = action.payload|| 'Failed to update bio';
      });
  },
});


export const {ResetSucessError,SetForgot,SetCurrentUpdate} = authSlice.actions

export default authSlice.reducer;
