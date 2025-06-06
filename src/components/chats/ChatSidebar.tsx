import React, {    useCallback, useEffect,  useState } from 'react';
import { List,  ListItemButton,  Skeleton } from '@mui/material';
import SearchContact from './SearchContact';
import { AppDispatch, BACKEND_URL_API, useAppSelector } from '../../redux/store';
import { appendChat, ContactType, deleteChat, deletedBy_contact, online_offline, setLoading, unReadUpdate, updateBlocked, updateCurrent } from '../../redux/slice/chat/mainChats';
import {  useDispatch } from 'react-redux';
import { ChangeTab } from '../../redux/slice/other/tabs';
import {  updateScrollIt } from '../../redux/slice/message/mainMessage';
import { unstable_batchedUpdates } from 'react-dom';
import { GetChatApiCall } from '../../redux/slice/chat/getChats';
import AddChatsApiCall from '../../redux/slice/chat/addChats';
import { ContactLister } from './ContactLister';
import { useSocket } from '../../handlers/socket/SocketContext';
import { OnlineOfflineHandlerType } from './chatTypes';

const ChatSidebar: React.FC = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const contacState = useAppSelector((state)=>state.chats);

  const loading = useAppSelector((state)=>state.chats.loading);

  const currentTab = useAppSelector((state)=>state.tabs.currentTab);

  const contactlist = contacState.list
  const current = contacState.current

  const [results, setResults] = useState<ContactType[]|null>(null); 
  
  const [debouncedQuery, setDebouncedQuery] = useState(""); 


  const dispatch = useDispatch<AppDispatch>()

  const socket = useSocket()

  useEffect(()=>{
    dispatch(GetChatApiCall())
  },[dispatch])



  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery); 
    }, 500); 

    return () => clearTimeout(timer); 
  }, [searchQuery]);


  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setResults(null); 
      return;
    }else{
    const fetchContacts = async () => {
      dispatch(setLoading(true))
      const list = contactlist.filter((con) => con.username?.match(new RegExp(`^${searchQuery}`, 'i')));
      if (list.length>0) {
        setResults(list);
        dispatch(setLoading(false))
      }else{
      try {
          const response = await fetch(`${BACKEND_URL_API}/user/search?username=${searchQuery}`, 
          {method:"GET",credentials:"include"});
          const data = await response.json()
          if (data.users) {
            setResults(data.users)
          }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        dispatch(setLoading(false))
      }
    }
  };

    fetchContacts();
}
  }, [dispatch,contactlist,searchQuery,debouncedQuery]); 



 
  
  const handleContactClicked = useCallback(async(currentUser:ContactType)=>{
    unstable_batchedUpdates(()=>{
      if (!currentUser?.chatId&&!contactlist.some(con=>con.username==currentUser?.username)) {
        dispatch(AddChatsApiCall({contact:currentUser}))
      }else if(currentUser?.chatId){
        if (currentUser.chatId!=current?.chatId) {
          dispatch(updateCurrent(currentUser));
          socket?.emit('read-messages',{chatId:currentUser.chatId,contactId:currentUser._id})
        }
      }
      dispatch(unReadUpdate({chatId:currentUser.chatId,unreadCount:0}))
      setSearchQuery('')
      setResults(null)
      dispatch(ChangeTab("chats"))
      dispatch(updateScrollIt(true))
    
    })
  },[contactlist,current,dispatch,socket])

  const AddedContact = useCallback((data:ContactType)=>{
    dispatch(appendChat(data))
  },[dispatch])

  const DeleteContact = useCallback((data:string)=>{
    dispatch(deleteChat(data))
  },[dispatch])

  const DeleltedBy = useCallback((data:ContactType)=>{
    dispatch(deletedBy_contact(data))
  },[dispatch])

  const Online_OfflineHandler = useCallback((data:OnlineOfflineHandlerType)=>{
    dispatch(online_offline(data))
  },[dispatch])

  const BlockedUpdateHandler = useCallback((data:ContactType)=>{
    dispatch(updateBlocked(data))
  },[dispatch])

  useEffect(()=>{
    if (!socket) return;
        socket?.on("added-contact",AddedContact)
        socket?.on("deleted-contact",DeleteContact)
        socket?.on("deletedBy-contact",DeleltedBy)
        socket.on("contact-status",Online_OfflineHandler)
        socket.on("block-update",BlockedUpdateHandler)

    return()=>{
      socket?.off("added-contact",AddedContact)
      socket?.off("deleted-contact",DeleteContact)
      socket?.off("deletedBy-contact",DeleltedBy)

      socket.off("contact-status",Online_OfflineHandler)
      socket.off("block-update",BlockedUpdateHandler)
    }
  },[socket,current,contactlist,AddedContact,BlockedUpdateHandler,DeleltedBy,DeleteContact,Online_OfflineHandler])


  const handleNameClick = () =>{
    if(current)
    dispatch(updateCurrent(null));
    dispatch(ChangeTab('chats'))
  }




  return (
    <div className={`md:w-[20%] w-full md:block ${(currentTab!='chats' || current)?" hidden ":"block"} px-2 h-full bg-light-sidebar dark:bg-dark-sidebar text-light-textPrimary dark:text-dark-textPrimary`}>

      <h1 className='text-left font-bold text-2xl p-2 text-blue-700 cursor-pointer' onClick={handleNameClick}>Hii Hello</h1>
      <SearchContact searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <List>
        {
              loading ? 
              <ListItemButton className='flex gap-2' >
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
                <div className='flex flex-col p-0 text-left w-[80%]'>
                  <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }}/>
                  <Skeleton animation="wave" height={10} width="40%" />
                </div>
              </ListItemButton> 
              :
               <ContactLister 

               list={(results)?results:contactlist} 
               handler={handleContactClicked} 
               current={current} />
          }
      </List>
    </div>
  );
};

export default ChatSidebar;


