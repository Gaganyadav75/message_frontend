
import { Button, IconButton, Typography } from '@mui/material';

import { ContactType } from '../../redux/slice/chat/mainChats';
import ChatsProfileMenu from './ChatProfile';
import { AppDispatch, useAppSelector } from '../../redux/store';
import { Delete, Phone, Search, Shortcut, VideoCall } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { ResetSelectedMessage, setForward } from '../../redux/slice/other/select';
import { setSearch } from '../../redux/slice/other/search';
import { publish } from '../../handlers/reusable/Event';
import { useCallback } from 'react';
import { useSocket } from '../../handlers/socket/SocketContext';


const ChatHeader= ({current}:{current:ContactType}) => {

  const selectedMessage = useAppSelector(state=>state.select.messages)
  const search = useAppSelector(state=>state.search.search)
  const user = useAppSelector(state=>state.auth.user)
  const dispatch = useDispatch<AppDispatch>()

  const handleCancel = useCallback(() =>{
    dispatch(ResetSelectedMessage(undefined))
    dispatch(setForward(false))
  },[dispatch])
  const forwardHandler = useCallback(() =>{
    dispatch(setForward(true))
  },[dispatch])

  const socket = useSocket()

  const DeleteMessage = ()=>{
    if (selectedMessage && user) {
      socket?.emit("delete-message",{_id:user._id,messageIdList:selectedMessage.map(ele=>ele._id),contactId:current?._id,chatId:current?.chatId})
    }else{
      alert('select some messages first')
    }
    dispatch(ResetSelectedMessage(undefined))
  }

  const toggleSearch = useCallback(() =>{
    dispatch(setSearch(!search))
  },[search,dispatch])

  const audioCall = useCallback(() =>{
    publish('initiate-call',{video:false,to:current})
  },[current])
  const videoCall = useCallback(() =>{
    publish('initiate-call',{video:true,to:current})
  },[current])
 

  return (
    <div
    className='py-2 px-4 flex items-center relative justify-between bg-light-chatHeader dark:bg-dark-chatHeader text-light-textPrimary dark:text-dark-textPrimary'
    >

<ChatsProfileMenu user={current}/>

<div className='flex gap-4'>
  <button  onClick={videoCall} title="video call" className="p-2 h-fit rounded-md aspect-square hover:bg-gray-600" >
    <VideoCall/>
  </button>
  <button  onClick={audioCall} title="call" className="p-2 h-fit rounded-md aspect-square hover:bg-gray-600" >
    <Phone/>
  </button>
  <button  onClick={toggleSearch} title="search" className="p-2 h-fit rounded-md aspect-square hover:bg-gray-600" >
    <Search/>
  </button>

</div>
 

      {
        selectedMessage.length>0 && 
        <div className=' bg-light-chatHeader dark:bg-dark-chatHeader flex px-4 w-full h-full absolute top-0 left-0 justify-between items-center'>
          <Typography variant='h6'>Selected</Typography> 
          <div className='flex gap-2'>
          {(selectedMessage?.find((val)=>val.sender!=user?._id))?null: 
            <IconButton onClick={DeleteMessage}><Delete/></IconButton>}

            <IconButton onClick={forwardHandler}><Shortcut/></IconButton>

  

            <Button onClick={handleCancel}>cancel</Button>
          </div>
        </div>
      }
          
      
    </div>
  );
};

export default ChatHeader;



