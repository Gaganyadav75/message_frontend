
import {   MouseEventHandler, useState } from "react";
import { validateField } from "../../handlers/reusable/ValidateFeild";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../redux/store";
import { InputChangeHandler } from "../../handlers/reusable/CommonHandler";
import { ResendEmail } from "../../redux/slice/user/resend";
import { loginUser } from "../../redux/slice/user/login";
import { LoadingSmall } from "../reusable/Loading";
import { ChangeSignTab } from "../../redux/slice/other/tabs";
import { FloatingLabelInput } from "../reusable/InputElement";
import { CustomButton } from "../reusable/Button";

export type LoginFormDataType = {
  id?:string;
  password?:string
}

function Login() {

  const [formData, setFormData] = useState<LoginFormDataType>({
    id: '',
    password: '',
 });

 
 const [errors, setErrors] = useState<LoginFormDataType>({});

  const dispatch = useDispatch<AppDispatch>();
  const authState = useAppSelector(state=>state.auth)

  const signTab = useAppSelector(state=>state.tabs.signTab)

const Handler:MouseEventHandler<HTMLButtonElement> = (event)=>{
  event.preventDefault();
  if(!formData.id || !formData.password)
    return;
  const erruser = validateField("username",formData.id as string);
  const errpass = validateField("password",formData.password as string);
  if (erruser || errpass) {
    setErrors((prev)=>{
      return {
        ...prev,
        id:erruser,
        password:errpass,
      }
     })
     return;
  }
  if (signTab=="resend"){
    dispatch(ResendEmail(formData));
    setFormData({id:"",password:""})
  }
  else
    dispatch(loginUser(formData));
}




const onChangeHandler = InputChangeHandler(setFormData)

  return (

  signTab=="signin"?
  <>
    <h3 className="text-4xl text-left font-bold mb-2 text-light-textPrimary dark:text-dark-textPrimary">Sign In</h3>
    <p className="text-left mb-2 font-semibold text-xl text-light-textSecondary dark:text-dark-textSecondary">
      "Welcome Back Buddy!"
    </p>

    <div className="w-full flex flex-col gap-5 mt-6"  >

        <FloatingLabelInput
          className="mb-2"
          name='id'
          error={errors.id}
          id="signin-id"
          label="Email / User Name"
          onChange={onChangeHandler}
          value={formData.id}
        />
      
        <FloatingLabelInput
         className="mb-2"
          name='password'
          error={errors.password}
          id="signin-password"
          label={"Password"}
          onChange={onChangeHandler}
          value={formData.password}
        />

        <CustomButton onClick={Handler} disabled={authState?.loading} type='submit'>{authState.loading?<LoadingSmall/>:"Login"}</CustomButton>
      
    </div>

    <div className='px-2 text-left mt-2 w-full flex justify-between text-light-textSecondary dark:text-dark-textSecondary'>

          <span className=" cursor-pointer font-medium  hover:underline" 
          onClick={()=>{dispatch(ChangeSignTab("signup"))}}>New User?</span>
          <span className=" cursor-pointer font-medium hover:underline" 
          onClick={()=>{dispatch(ChangeSignTab("forgot"))}}>Forgot Password?</span>
    </div>
  </>
  :
  <div className="flex flex-col gap-10">
    <h3 className="text-4xl text-left font-bold mb-2">Verification Pending</h3>

    <CustomButton onClick={Handler} disabled={authState?.loading} type='submit'>{authState.loading?<LoadingSmall/>:"Resend Verification Email"}</CustomButton>

        <div className='px-2 text-left mt-2 w-full flex justify-between'>
          <span className=" cursor-pointer font-medium hover:underline" 
          onClick={()=>{dispatch(ChangeSignTab("signin"))}}>Back </span>
    </div>

  </div> 
  )
}

export default Login