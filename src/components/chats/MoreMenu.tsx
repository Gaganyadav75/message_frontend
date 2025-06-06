import { Cancel, Download, SelectAll, Send, Shortcut } from "@mui/icons-material";
import { Button, Fade, IconButton, Menu, MenuItem } from "@mui/material";

import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import { CopyAll, Delete } from '@mui/icons-material';
import { AppDispatch, useAppSelector } from "../../redux/store";
import { EachMessageTypes } from "../../redux/slice/message/mainMessage";
import { ContactLister } from "./ContactLister";
import SearchContact from "./SearchContact";
import { ContactType, updateCurrent } from "../../redux/slice/chat/mainChats";
import { useDispatch } from "react-redux";
import { AddtoSelectedMessage,ResetSelectedMessage, setForward } from "../../redux/slice/other/select";
import { getFileUrl } from "../reusable/profileUrl";
import { useState } from "react";
import { useSocket } from "../../handlers/socket/SocketContext";
import { MessageForwardContactListType } from "./chatTypes";

export function 
MessageMoreIcon({message,horizontal}:{message:EachMessageTypes,horizontal:number | "center" | "left" | "right"}) {

  const user = useAppSelector(state=>state.auth.user)
  const current = useAppSelector(state=>state.chats.current)
  const dispatch = useDispatch<AppDispatch>()
  const socket = useSocket()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const DeleteMessage = ()=>{
      if (message._id && user) {
        socket?.emit("delete-message",{_id:user._id,messageIdList:[message._id],contactId:current?._id,chatId:current?.chatId})
      }
      handleClose();
    }

    const copyTextHandler = ()=>{
        navigator.clipboard.writeText(message.text);handleClose()

    }
    const copyUrlHandler = ()=>{
        navigator.clipboard.writeText(getFileUrl(message?.attach||'','uploads'));handleClose()
    }

    const downloadFileHandler = () =>{
      handleClose()
      const link = document.createElement('a');
      link.href = getFileUrl(message?.attach||'','uploads');
      link.download = message.text;  
      link.target = '_blank'; 
      link.rel="noopener noreferrer" 
      link.click(); 
      document.body.removeChild(link);
    }

    const forwordClickHandler = ()=>{
      dispatch(AddtoSelectedMessage(message))
      dispatch(setForward(true))
      handleClose()
    }
    const selectClickHandler = ()=>{
      dispatch(AddtoSelectedMessage(message))
      handleClose()
    }

    const sent = user?._id==message?.sender

    const dark = useAppSelector(state=>state.tabs.darkmode)


  return (
        <>

  <span className='group-hover:opacity-100 opacity-0 transition-opacity duration-300 ease-in-out'>
  

      <Button
        className="rounded-full flex items-center justify-center p-0"
        size='small'
        id={'more-icon'}
        aria-controls={open ? 'message-more-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
          <span className="text-light-textPrimary dark:text-dark-textPrimary">
          <ArrowDropDownCircleIcon fontSize='small' />
          </span>

      </Button>

      

    </span>

        <Menu
        id="message-more-menu"
        MenuListProps={{
          'aria-labelledby': 'more-icon',
        }}
        anchorOrigin={{
            vertical: 'top',
            horizontal,
          }}
        transformOrigin={{
            vertical: 'top',
            horizontal,
          }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose }
        TransitionComponent={Fade}
        className=""
        slotProps={{
          paper:{
            sx:{bgcolor:dark?'#f2f2f7':'#2f2f3a',}
          }
      }}
      >
{message?.type != 'call' && (
  <MenuItem onClick={forwordClickHandler} className='gap-2'>
    <span className={(dark?"text-black":"text-white")}><Shortcut /> forword</span>
  </MenuItem>
)}
{message?.type != 'call' && (
  <MenuItem onClick={selectClickHandler} className='gap-2'>
    <span className={(dark?"text-black":"text-white")}><SelectAll /> select</span>
  </MenuItem>
)}
{message?.type != 'call' && (
  <MenuItem onClick={copyTextHandler} className='gap-2'>
    <span className={(dark?"text-black":"text-white")}><CopyAll /> copy</span>
  </MenuItem>
)}
{message?.attach && (
  <MenuItem onClick={copyUrlHandler} className='gap-2'>
    <span className={(dark?"text-black":"text-white")}><CopyAll /> copy url</span>
  </MenuItem>
)}
{message?.attach && (
  <MenuItem onClick={downloadFileHandler} className='gap-2'>
    <span className={(dark?"text-black":"text-white")}><Download /> Download</span>
  </MenuItem>
)}
{sent && (
  <MenuItem onClick={DeleteMessage} className='gap-2'>
    <span className={(dark?"text-black":"text-white")}><Delete /> Delete</span>
  </MenuItem>
)}


      </Menu>
    

</>

  );
}   






export const MessageForwordContactList = ({element,setElement}:MessageForwardContactListType) =>{

  const socket = useSocket()

  const [selectedList,setSelectedList] = useState<ContactType[]>([]);
  const contactList = useAppSelector(state=>state.chats.list)
  const user = useAppSelector(state=>state.auth.user)

  const [searchQuery,setSearchQuery] = useState<string>('');

  const selectedMessages = useAppSelector(state=>state.select.messages)
  const forward = useAppSelector(state=>state.select.forward)

  const handleClose = () => {
    dispatch(setForward(false))
    setElement(null);
  };


  const dispatch = useDispatch<AppDispatch>()




  const selectHandler = (user:ContactType) =>{
    if (selectedList.some(ele=>ele.chatId==user.chatId)) {
      setSelectedList(state=>{return state.filter(ele=>ele.chatId!=user.chatId)})
    }else{
      setSelectedList(state=>{return[...state,user]})
    }
    setSearchQuery('')
  }


  const sendHandler = () =>{
    if (selectedList.length>0) {
      
      selectedList.forEach(ele=>{
        socket?.emit('forward-message',{_id:user?._id,chatId:ele.chatId,participantId:ele._id,info:selectedMessages})
      })
      dispatch(updateCurrent(selectedList[0]))
      dispatch(ResetSelectedMessage(undefined))
      setSelectedList([])
      dispatch(setForward(false))
      setSearchQuery('')
    }else{
      alert('no list provided')
    }
  }
  const Cancelhandler = () =>{
    dispatch(setForward(false))
    setSelectedList([])
  }

  if (!selectedMessages ||!element || !forward) {
    return null
  }


  return (
    
    <Menu
        id="fordward-menu"
        anchorOrigin={{
            vertical: 'top',
            horizontal:'left',
          }}
        transformOrigin={{
            vertical: 'top',
            horizontal:'left',
          }}    
        anchorEl={element}
        open={Boolean(element)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >

    <div className="flex flex-col w-full overflow-y-scroll no-scrollbar rounded-md z-50 y bg-light-chatHeader dark:bg-dark-chatHeader p-2">

      <div className="flex justify-between px-2 sticky text-light-textPrimary dark:text-dark-textPrimar">
        <h1 >Forward</h1>
        {selectedList?.length>0?<IconButton onClick={sendHandler}><Send/></IconButton>:<IconButton onClick={Cancelhandler}><Cancel/></IconButton>}
      </div>
      <SearchContact searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchIcon={false} small={true}/>
      <ContactLister 
      list={searchQuery?contactList.filter(ele=>ele.username?.match(new RegExp(`^${searchQuery}`, 'i'))):contactList} handler={selectHandler} checkbox={true} checkedList={selectedList}/>

    </div>

    </Menu>
  )

}



// not in use right now


