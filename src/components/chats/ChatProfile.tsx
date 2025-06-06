import { useCallback, useEffect, useState} from 'react';
import { Avatar, Button, CardMedia, Divider, Typography } from '@mui/material';
import { ContactType } from '../../redux/slice/chat/mainChats';
import { AppDispatch, useAppSelector } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { DeleteChatApiCall } from '../../redux/slice/chat/deleteChat';
import { BlockChatApiCall } from '../../redux/slice/chat/blockChat';
import { UnblockChatApiCall } from '../../redux/slice/chat/unBlockChat';
import { getFileUrl } from '../reusable/profileUrl';
import { useSocket } from '../../handlers/socket/SocketContext';
import { publish } from '../../handlers/reusable/Event';
import MenuDropdown from '../reusable/MenuDropdown';
import { ConfirmDialogBox } from '../reusable/ConfirmationDialogBox';
import BackButton from '../reusable/BackButton';
type ChatProfileType = {
    user:ContactType
}
export default function ChatsProfileMenu({user}:ChatProfileType) {

  const [open, setOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const socket = useSocket()

  const handleClick = () =>{
    setOpen(true);
  }


   const typingChange = useCallback((_id:string) =>{
      if (_id==user._id && user.isOnline) {
        setIsTyping(true)
      }
    },[user])
  
    useEffect(()=>{
      const timeoutId = setTimeout(()=>{
        setIsTyping(false)
      },2000)

      return()=>{
        clearTimeout(timeoutId)
        }
    },[isTyping])

    useEffect(()=>{
      if (!socket) return;

        socket?.on("typing",typingChange)
      return()=>{
        socket.off("typing",typingChange)
      }
    },[socket,typingChange])


    const btn =     
    <div 
    onClick={handleClick}
    className='flex px-2 gap-2 items-center'>

    <Avatar src={getFileUrl(user?.profile,'profiles')}/>

    <div className='flex flex-col p-0 text-left'>
        <Typography fontWeight={"bolder"} variant="subtitle1">{user?.username}</Typography>
        <Typography variant="caption" color={user?.isOnline?"yellow":""} align='left'>{isTyping?'typing...':user?.isOnline?"Online":"Offline"}</Typography>
    </div>

  </div>;

  return (
    <div className='relative flex'>
    <BackButton className='md:hidden grid '/>
    <MenuDropdown 
    className='flex flex-col bg-light-chatProfileBg dark:bg-dark-chatProfileBg w-fit left-0 p-5 pr-8 ' 
    open={open} 
    setOpen={setOpen} 
    menuButton={btn}> 
        <DrawerList user={user}/>

      </MenuDropdown> 

    </div>
  );
}


const DrawerList = ({user}:ChatProfileType)=>{
  const userInfo = useAppSelector((state)=>state.auth.user)
  const _id = userInfo?._id

  const [open,setOpen] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const handleDelete = () =>{
    dispatch(DeleteChatApiCall({contact:user}))
  }


  const blockBtnClick = () =>{

    if (!user.isBlocked) {
      dispatch(BlockChatApiCall({contact:user}))
    }else if (user?.blockedBy==_id) {
     dispatch(UnblockChatApiCall({contact:user}))
    }
    
  }


    const handleProfileClick = useCallback(()=>{
      const fl = {attach:getFileUrl(user?.profile,'profiles')|| "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg",type:'image'}
      publish("view-files",{list:[fl],current:0})
    },[user.profile])


    return(
    <div className='flex p-0'>
        <div className='w-fit flex flex-col text-left text-light-textPrimary dark:text-dark-textPrimary'>
            <CardMedia  
        component="img"
        onClick={handleProfileClick}
        sx={{aspectRatio:"1/1",maxWidth:"200px",width:"30%",minWidth:"50px"}}
        image={getFileUrl(user?.profile,'profiles')|| "https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg"}
        alt="Live from space album cover"
      />
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '8px',mt:'5px' }}>
            {user?.username}
          </Typography>
    
          <Divider sx={{ backgroundColor: '#555', marginY: '8px' }} />
    
          <Typography variant='subtitle1' sx={{  marginBottom: '4px' }}>
            Bio
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: '12px' }}>
            {user?.bio}
          </Typography>
            
          <Typography variant="subtitle1" sx={{  marginBottom: '4px' }}>
            Email
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {user?.email}
          </Typography>
          <br/>
          <Divider sx={{ backgroundColor: '#555', marginY: '8px' }} />

            <div className='w-full flex justify-between'>
          {/* Block Button */}
          <Button
          onClick={blockBtnClick}
          variant="contained"
          disabled={user.isBlocked && user.blockedBy!=_id}
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
         {!user.isBlocked?"Block":user?.blockedBy==_id?"Unblock":'Blocked'} 
        </Button>


{/* Delete Button */}
          <Button
             onClick={()=>{
              
              setOpen(true)
          
            }}
       
          variant="contained"
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
         {'Delete'}
        </Button>
        </div>
          
          <Typography variant="caption" sx={{ color: '#aaa', marginTop: '16px' }}>
            Chat history on this computer will be cleared when you log out.
          </Typography>
        </div>
              
              {
              <ConfirmDialogBox
              isOpen={open}
              heading='"Do you want to continue?"'
              subHeading='you can not get the messages back'
              button1={{title:"No",onClick:()=>{setOpen(false)}}}
              button2={{title:"Delete",onClick:handleDelete}}
              />
              }
    </div>

  )
}
