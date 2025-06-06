import {  CardMedia, CircularProgress } from "@mui/material";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "../../redux/store";
import { UpdateProfile } from "../../redux/slice/user/update";
import { publish } from "../../handlers/reusable/Event";
import { Edit } from "@mui/icons-material";

type profiletype = {
    profile:string|undefined
}
export function ProfilePhoto({profile}:profiletype) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [newProfile,setNewProfile] = useState<string|null| ArrayBuffer>(null)
    const [file,setFile] = useState<File|undefined>()
    const dispatch =  useDispatch<AppDispatch>()

    const loading = useAppSelector((state)=>state.auth.loading) ;

    const HandleChangeImageClick = useCallback((event:ChangeEvent<HTMLInputElement>) =>{
        const file = event.target.files?.[0];
        if (file) {
        setFile(event.target.files?.[0])
      // Handle file upload logic here
        const reader = new FileReader();
        reader.onload = function (e) {
            setNewProfile(e.target?.result||"")
        }
        reader.readAsDataURL(file)
    }
    },[])

    const UpdateProfileHandler = useCallback(() =>{
        if (file && file.size<(1 * 1024 * 1024) ) {
            dispatch(UpdateProfile(file))
            setNewProfile(null)
            setFile(undefined)
        }else{
          alert("image is large")
          setNewProfile(null)
          setFile(undefined)
        }
    },[setNewProfile,file,dispatch])

    const onChangClickHandler = useCallback(()=>{
        if(!newProfile){
          fileInputRef.current?.click(); 
        }else{
            setNewProfile(null);
            setFile(undefined)
        }
      },[newProfile])

      const handleProfileClick = useCallback(()=>{
        const fl = {attach:newProfile?String(newProfile):profile?profile:"static/profile-placeholder.svg",type:'image'}
        publish("view-files",{list:[fl],current:0})
      },[newProfile,profile])

  return (

      <div className={` mt-[6%] w-full p-0 min-h-48 h-fit flex justify-center md:justify-center items-center md:items-start text-light-textPrimary dark:text-dark-textPrimary`} >
      <div className="flex flex-col text-left rounded-[10px] w-[65%]  lg:w-1/2 max-md:w-1/4 min-w-[150px] "  >
      {loading?
      <div className="grid place-items-center w-full aspect-square">
        <CircularProgress />
      </div>
      :
      <div className="border-gray-300 group drop-shadow-2xl  border-2 relative aspect-square ">
      <CardMedia
        onClick={handleProfileClick}
        component="img"
        sx={{aspectRatio:"1/1"}}
        image={newProfile?String(newProfile):profile?profile:"static/profile-placeholder.svg"}
        alt="Live from space album cover"
      />

       <button className={`active:scale-105 absolute top-1 group-hover:opacity-90 opacity-0 hover:opacity-100 bg-opacity-85 drop-shadow-lg  bg-[radial-gradient(circle,_#374151_10%,_rgba(255,0,0,0))] hover:bg-gray-700 right-1 w-fit p-2 transition-all duration-700 ease-in-out  rounded-full ${newProfile?" hidden":" "}`}
        onClick={onChangClickHandler}
        >
        <Edit className={'text-white'}/>
        </button>
      </div>
      
      }

      
        <div className="flex justify-between text-light-textPrimary dark:text-dark-textPrimary ">
        <button className={`w-fit mt-[10px] px-3 py-2 transition-colors duration-700 ease-in-out bg-red-500 rounded-sm ${newProfile?" inline-block ":" hidden"}`}
        onClick={onChangClickHandler}
        >
          Cancel
        </button>

        {newProfile && <button 
         className={`w-fit mt-[10px] px-3 py-2 rounded-sm bg-green-500 `}
        onClick={UpdateProfileHandler}
        >
          Update
        </button>}
        </div>
        <input
        title="change"
        type="file"
        ref={fileInputRef}
        onChange={HandleChangeImageClick}
        className=' hidden'
        accept="image/*" // Optional: restrict to images only
      />
    
      </div>
    </div>
  )
}
