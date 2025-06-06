import React, { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { AppDispatch, useAppSelector } from '../../redux/store';
import { useDispatch } from 'react-redux'
import { AuthToken } from '../../redux/slice/user/verify';

export const RouteProtector: React.FC = () => {
  // let navigate = useNavigate()
  const user = useAppSelector((state)=>state.auth.user)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!user) {
        dispatch(AuthToken())
    }
  }, [user,dispatch]);
  

  return null; // Optionally render a loading spinner or nothing
};


export const PrivateRoutes = () => {

  const navigate = useNavigate();
  const {user} = useAppSelector((state)=>state.auth)




  useEffect(()=>{
    if (user) {
      navigate("/")
    }else{
      navigate("/sign")
    }
  },[user,navigate])

  return null;
};

