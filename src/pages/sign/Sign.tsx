
import { useCallback, useEffect, useState } from "react";
import Login from "../../components/sign/Login";
import TermsAndConditionsDialog from "../../components/reusable/TermsCondition";
import { AppDispatch, useAppSelector } from "../../redux/store";
import Signup from "../../components/sign/Signup";
import Forgot from "../../components/sign/Forgot";
import { ChangeSignTab } from "../../redux/slice/other/tabs";
import { subscribe, unsubscribe } from "../../handlers/reusable/Event";
import { useDispatch } from "react-redux";
import VerifyEmail from "../../components/sign/VerifyEmail";
import DarkModeSwitch from "../../components/reusable/DarkModeSwitch";



export default function Sign() {


  const signTab = useAppSelector((state)=>state.tabs.signTab)

  const [open,setOpen] = useState(false)
  const dispatch = useDispatch<AppDispatch>();

 const onClose = ()=>{
  setOpen(!open)
}


    const ChangeTabHandler = useCallback(({detail}:CustomEvent)=>{
      dispatch(ChangeSignTab(detail))
    },[dispatch])

    useEffect(()=>{
      subscribe("changesigntab",ChangeTabHandler);
      return()=>{
        unsubscribe("changesigntab",ChangeTabHandler);
      }
    },[ChangeTabHandler])
  
  return (
    <>
      <div className="flex w-full px-5 py-3 absolute top-0 left-0 text-left font-bold text-2xl p-2 bg-light-chatBg dark:bg-dark-chatBg text-blue-500 cursor-pointer">
        <div className="flex h-10 gap-2 items-center align-baseline">
            <img className="h-full aspect-square" src="logo.jpeg" alt="logo" />
            <h1 className="text-left h-fit">Hii Hello</h1>
        </div>
      
        <DarkModeSwitch />
      </div>
      <div className="flex justify-center items-center h-full bg-light-chatBg dark:bg-dark-chatBg text-light-textPrimary dark:text-dark-textPrimary">
        <div className="flex justify-center items-center mt-10">
          <div className="relative p-0 m-0 md:w-[30rem] w-full min-w-[300px]">
            <>
              {(signTab == "signin" || signTab == "resend") && <Login />}

              {signTab == "signup" && <Signup />}

              {signTab == "verify" && <VerifyEmail />}

              {signTab == "forgot" && <Forgot />}
            </>
          </div>
        </div>
      </div>

      

      <a
        onClick={onClose}
        className="absolute bottom-3 right-5 font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
      >
        Term & conditions
      </a>

      <TermsAndConditionsDialog onClose={onClose} open={open} />
    </>
  );
}
