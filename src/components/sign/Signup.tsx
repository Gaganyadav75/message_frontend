
import {    FormEvent, useState } from 'react';
import { validateField } from '../../handlers/reusable/ValidateFeild';

import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../redux/store';
import { InputChangeHandler } from '../../handlers/reusable/CommonHandler';
import { signupUser } from '../../redux/slice/user/signup';
import { LoadingSmall } from '../reusable/Loading';
import { ChangeSignTab } from '../../redux/slice/other/tabs';
import { FloatingLabelInput } from '../reusable/InputElement';
import { CustomButton } from '../reusable/Button';


interface SignUpErroType {
  username?:string;
  email?:string;
  password?:string;
}


function Signup() {

    const [signUpFormData,setSignUpFormData] = useState({
    username:"",
    email:"",
    password:"",
  })
 
     const [errors, setErrors] = useState<SignUpErroType>(
      {
      email:"",
      password:"",
      username:""
     });

     const authState = useAppSelector(state=>state.auth)

     const dispatch = useDispatch<AppDispatch>();


     const onChangeHandler = InputChangeHandler(setSignUpFormData)

 

     const Handler = (event:FormEvent<HTMLFormElement>)=>{
      event.preventDefault();
      
      const email = validateField("email",signUpFormData.email);
      const username = validateField("username",signUpFormData.username);
      const password = validateField("password",signUpFormData.password);

      const errdata = {email,password,username}
      setErrors(()=>errdata)

      
      if (email || username || password) {
      return
      }

      if (!authState.user) {
        dispatch(signupUser({...signUpFormData}))
      }

    }

    




  return (
  <>
        <h3 className="text-4xl text-left font-bold mb-2">Sign Up</h3>
        <p className="text-left mb-4 font-semibold text-xl">
          "Discover something new!"
        </p>
     
        <form className='w-full flex flex-col gap-5' onSubmit={Handler}>
    

        <FloatingLabelInput
          name='username'
          error={errors?.username}
          id="signup-username"
          label="User Name"
          onChange={onChangeHandler}
        />
        <FloatingLabelInput
          name='email'
          error={errors?.email}
          id="signup-email"
          label="Email"
          onChange={onChangeHandler}

        />
        <FloatingLabelInput
          name='password'
          error={errors?.password}
          id="signup-password"
          label={"Password"}
          onChange={onChangeHandler}

        />

          <CustomButton disabled={authState.loading} type='submit'>{authState.loading?<LoadingSmall/>:"Register"}</CustomButton>
       
        </form>
        <div className='px-2 text-left mt-2 w-full flex justify-between text-light-textSecondary dark:text-dark-textSecondary'>
          <span>

          </span>
        <span className=" cursor-pointer font-medium  hover:underline" 
          onClick={()=>{dispatch(ChangeSignTab("signin"))}}>have an account?</span>
      </div>
  </>
  )
}

export default Signup










