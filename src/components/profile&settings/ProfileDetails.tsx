
import { Typography, Button, } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../redux/store';
import {  SetCurrentUpdate, UserStateInAuth } from '../../redux/slice/user/mainAuth';
import { logoutUser } from '../../redux/slice/user/logout';

import { ChangeEvent, useCallback,  useRef,  useState } from 'react';
import { Edit, } from '@mui/icons-material';
import { LoadingSmall } from '../reusable/Loading';
import { UpdateUserData } from '../../redux/slice/user/update';
import {  ProfileInputElement } from '../reusable/InputElement';



const ProfileDetails= ({user}:{user:UserStateInAuth|null}) => {

       const dispatch = useDispatch<AppDispatch>();


  const handleLogout = useCallback(()=>{
    dispatch(logoutUser())
  },[dispatch])

  return (
    <>

    <div className={`p-0  items-center md:items-start w-full flex flex-col`}>


      <div className={`p-[5%] mt-[5%] w-fit text-left flex flex-col text-light-textPrimary dark:text-dark-textPrimary`}>
      <UserNameComponent title='Username' data={user?.username}/>

        <br/>
      <Component title='Bio' data={user?.bio}/>
    
        <br/>

      <Component title='Email' data={user?.email}/>

        <br/>
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
          backgroundColor: '#d32f2f',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#b71c1c',
          },
          width:"fit-content",
          marginTop: '16px',
        }}
      >
        Log out
      </Button>
      <Typography variant="caption" sx={{ color: '#aaa', marginTop: '16px' }}>
        Chat history on this computer will be cleared when you log out.
      </Typography>

      </div>
    </div>


    </>
  );
};

export default ProfileDetails;



const Component = ({title,data}:{title:string,data:string|undefined})=>{

const [value,setValue] = useState(data)

const inputRef = useRef<HTMLInputElement| null>(null)

  const dispatch = useDispatch<AppDispatch>()

  const updatestate= useAppSelector(state=>state.auth.update)
  const edit = updatestate==title.toLowerCase()

  const loading = useAppSelector(state=>state.auth.updateloading)

  const EditClickHandler = () =>{
    if (edit) {
      if (value && value!=data) {
        dispatch(UpdateUserData({[title.toLowerCase()]:value}))
      }else{
      dispatch(SetCurrentUpdate(null))
        
      }
    }else{
       dispatch(SetCurrentUpdate(title.toLowerCase()))
    }
  }

  return(
    <>

    <span className='w-full relative'>
    <Typography variant="h6" className='flex md:text-xl text-md justify-between w-full text-light-textSecondary dark:text-dark-textSecondary' >
        {title}
    </Typography>
            {
          !updatestate || updatestate==(title.toLowerCase())
          ?
          loading
          ?
          <span className='absolute top-0 right-0 w-[10%] aspect-square '><LoadingSmall/></span>
          :
          <span className='absolute top-0 right-0'>
          <button className='w-fit absolute top-0 right-0' onClick={EditClickHandler}>
            <span className='text-light-textPrimary dark:text-dark-textPrimary'>
            <Edit color={edit?'secondary':undefined} fontSize='small'/>
            </span>
          </button>
          </span>
          :null
        }
    </span>

   
     <ProfileInputElement
     inputRef={inputRef}
      name={title}
      disabled={!edit}  
      value={edit?value:data} 
      className='md:text-md text-sm'
      onChange={(e:ChangeEvent<HTMLInputElement>)=>{setValue(e.target.value);inputRef.current?.focus();}}/>

    <hr className='text-light-textPrimary dark:text-dark-textPrimary'/>
      
    </>
  )
}


const UserNameComponent = ({title,data}:{title:string,data:string|undefined})=>{

  const [value,setValue] = useState(data)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useDispatch<AppDispatch>()

  const updatestate= useAppSelector(state=>state.auth.update)
  const edit = updatestate==title.toLowerCase()

  const loading = useAppSelector(state=>state.auth.updateloading)

   const EditClickHandler = () =>{
    if (edit) {
      if (value && value!=data) {
        dispatch(UpdateUserData({[title.toLowerCase()]:value}))
      }else{
        dispatch(SetCurrentUpdate(null))
      }
    }else{
       dispatch(SetCurrentUpdate(title.toLowerCase()))
    }
  }

  



  return(
    <div className='relative '>



      <ProfileInputElement
      name='profile-username'
      inputRef={inputRef}
      disabled={!edit}  
      value={edit?value:data} 
      className='md:text-3xl text-2xl text-light-textSecondary dark:text-dark-textSecondary'
      onChange={(e:ChangeEvent<HTMLInputElement>)=>{ setValue(e.target.value);inputRef.current?.focus();}}/>
        
      <br/> <hr className='text-light-textPrimary dark:text-dark-textPrimary'/>

      <div className='absolute top-0 right-0 text-light-textSecondary dark:text-dark-textSecondary ' >
     
     {
        !updatestate || updatestate==(title.toLowerCase())
      ?
        loading
      ?
        <span className='w-[10%] aspect-square'><LoadingSmall/></span>
      :
        <>
        <button onClick={EditClickHandler}>
          <span className='text-light-textPrimary dark:text-dark-textPrimary'>
               <Edit color={edit?'secondary':undefined} fontSize='small'/>
          </span>
         
        </button>
        </>
      :null
      }
      </div>

    </div>
  )
}








