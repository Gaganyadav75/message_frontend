
import {  MouseEventHandler, useState } from "react";

import { validateField } from "../../handlers/reusable/ValidateFeild";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../redux/store";
import { InputChangeHandler } from "../../handlers/reusable/CommonHandler";
import { LoadingSmall } from "../reusable/Loading";
import { ChangeSignTab } from "../../redux/slice/other/tabs";
import { ForgotSendCode, ForgotVerifyCode } from "../../redux/slice/user/Forgot";
import { SetForgot } from "../../redux/slice/user/mainAuth";
import { FloatingLabelInput } from "../reusable/InputElement";
import { CustomButton } from "../reusable/Button";



interface formDataForgetType{
email?:string,
otp?:string,
password?:string,
}


function Forgot() {

  const [formData, setFormData] = useState<formDataForgetType>({
    email: '',
    otp: '',
    password:""
 });

 const forgotState = useAppSelector(state=>state.auth.forgot)
 
 const [errors, setErrors] = useState<formDataForgetType>({});

  const dispatch = useDispatch<AppDispatch>();
  const authState = useAppSelector(state=>state.auth)



 const EmailHandler:MouseEventHandler<HTMLButtonElement> = ()=>{

  const erruser = validateField("email",formData.email as string);

    setErrors((prev)=>{
      return {
        ...prev,
        email:erruser,
      }
     })

 formData.email && dispatch(ForgotSendCode(formData.email))

}
 const OTPHandler:MouseEventHandler<HTMLButtonElement> = ()=>{

  const erruser = validateField("email",formData.email as string);
  const errpass = validateField("password",formData.password as string);
  const errotp = validateField("otp",formData.otp as string);
  if (erruser || errpass) {
    setErrors({email:erruser,otp:errotp,password:errpass})
     return;
  }

  formData && dispatch(ForgotVerifyCode(formData))

}


const onChangeHandler = InputChangeHandler(setFormData)

  return (
    <>
  <h3 className="text-4xl text-left font-bold mb-2 text-light-textPrimary dark:text-dark-textPrimary">Forget Password</h3>

   

      {forgotState!='verified'?
      <>
        <p className="text-left mb-2 font-semibold text-xl text-light-textSecondary dark:text-dark-textSecondary">
          "reset with email otp !"
        </p>
        <div className="w-full flex flex-col gap-5 mt-6" >

     
          
          <FloatingLabelInput
          name='email'
          error={errors.email}
          label="Email"
          onChange={onChangeHandler}
          value={formData.email}
        />
        
      {
      !forgotState &&  
        <CustomButton
        onClick={EmailHandler}
        disabled={authState.loading} 
        type='submit'>
          {authState.loading?<LoadingSmall/>:"Verify"}
        </CustomButton>

        }

      {
        forgotState == "sent"&& 
        <>
        <FloatingLabelInput
          label="otp"
          name='otp'
          error={errors.otp}
          onChange={onChangeHandler}
          value={formData.otp}
        />

         <FloatingLabelInput
          name='password'
          error={errors.password}
          label={"New Password"}
          onChange={onChangeHandler}
          value={formData.password}
        />

      <CustomButton onClick={OTPHandler} disabled={authState.loading}  type='submit'>{authState.loading?<LoadingSmall/>:"Submit"}</CustomButton>
        </>
      }
       
        </div>

         <div className='px-2 text-left mt-2 w-full flex justify-between text-light-textSecondary dark:text-dark-textSecondary'>
     
          <span className="[&>] cursor-pointer font-medium hover:underline" 
          onClick={()=>{dispatch(SetForgot(null));dispatch(ChangeSignTab("signin"))}}> Back </span>
         {!forgotState && <span className="[&>] cursor-pointer font-medium  hover:underline" 
          onClick={()=>{dispatch(SetForgot("sent"))}}> have an otp </span>}
        </div>

      </>
      :
      <>
        <p className="text-left mb-2 font-semibold text-md ">
          "Password reset successfully!" 
        </p>
        <div className='px-2 text-left mt-2 w-full flex justify-center'>
          <span className="mt-14 cursor-pointer font-medium text-light-textSecondary dark:text-dark-textSecondary hover:underline text-center" 
            onClick={()=>{dispatch(SetForgot(null));dispatch(ChangeSignTab("signin"))}}> Click to Login </span>
        </div>
      </>

    }

         


         
    </>
  )
}

export default Forgot