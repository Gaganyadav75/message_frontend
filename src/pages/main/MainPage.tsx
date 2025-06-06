
import  { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {  AppDispatch, useAppSelector } from '../../redux/store';
import Profile_SettingsMainPage from '../profile&settings/page'
import { subscribe, unsubscribe } from '../../handlers/reusable/Event';
import { deleteMessage, EachMessageTypes, messageSeen, sendMessage, updateAttachment, updateCallMessage } from '../../redux/slice/message/mainMessage';
import FilesCarousal from '../../components/chats/FilesCarousal';
import {  useSocket } from '../../handlers/socket/SocketContext';
const ChatMainPage = lazy(()=> import('../chat/Page'));
const ChatSidebar = lazy(()=> import('../../components/chats/ChatSidebar'));
const CallMain = lazy(()=> import('../../components/calls/CallMain'));
import { useDispatch } from 'react-redux';
import { unReadUpdate, updatedAt } from '../../redux/slice/chat/mainChats';
import { DeleteMessageHandlerType, MessageFileReceiveHandlerType, newMessageHandlerType, SocketErrorHandlerType } from '../../interfaces/pages';

import ProfileNav from '../../components/profile&settings/ProfileNav';
import ChatInitialUi from '../chat/ChatInitailUi';

import { Swiper, SwiperSlide } from 'swiper/react';
import LoadingComponent, { LoadingSmall } from '../../components/reusable/Loading';


function MainPage() {

const socket = useSocket()
const dispatch = useDispatch<AppDispatch>()


  const user = useAppSelector((state)=>state.auth.user);
  const current = useAppSelector((state)=>state.chats.current);
  const messages = useAppSelector((state)=>state.messages.list);

  const contactState = useAppSelector((state)=>state.chats);

  const [files, setFiles] = useState<{list:EachMessageTypes[],current:number} | null>(null);

  const handleViewFile = useCallback((event:CustomEvent) =>{
    setFiles({list:event.detail.list,current:event.detail.current})
  },[])

  useEffect(()=>{

    subscribe('view-files',handleViewFile)

    return() =>{
      unsubscribe('view-files',handleViewFile)
    }

  },[files,handleViewFile])

  

  const currentTab = useAppSelector((state)=>state.tabs.currentTab)

  
  const [isConnected,setIsConnected] = useState(false)


  const onConnectHandler = useCallback(() =>{
    console.log('connected to socket')
    setIsConnected(!isConnected)
  },[setIsConnected,isConnected])

  
  useEffect(()=>{
    socket?.on('connect', onConnectHandler);
    socket?.on("disconnect",onConnectHandler)
    return()=>{
      socket?.off('connect', onConnectHandler);
      socket?.off('disconnect', onConnectHandler);
    }
},[socket,isConnected,onConnectHandler])


  const newMessageHandler = useCallback(({info,chatId,sender}:newMessageHandlerType) =>{
      if (info && chatId && sender) {
          const messages = info
          if (chatId==current?.chatId||sender==user?._id) {
            dispatch(unReadUpdate({chatId,unreadCount:0}))
          }else if(info[0].type!='call' && info[0].type!='info'){
            dispatch(unReadUpdate({chatId,unreadCount:messages.length||0,increment:true}))
          }
         dispatch(sendMessage({chatId,messages,scrollIt:true,current:current?._id}))
         dispatch(updatedAt({chatId,updatedAt:messages[messages.length-1].time}))
  
        if (sender==current?._id) {
          socket?.emit('read-messages',{chatId,contactId:sender})
        }
      }
    },[current,socket,dispatch,user])

  const DeleteMessageHandler = useCallback((data:DeleteMessageHandlerType) =>{
    dispatch(deleteMessage(data))
  },[dispatch])
  const MessageSeenHandler = useCallback((data:string) =>{
    dispatch(messageSeen(data))
  },[dispatch])

  const MessageFileReceiveHandler = useCallback((data:MessageFileReceiveHandlerType) =>{
    dispatch(updateAttachment(data))
  },[dispatch])

  

  const UpdateMessageHandler = useCallback((data:EachMessageTypes)=>{
    dispatch(updateCallMessage(data))
  },[dispatch])


  const SocketErrorHandler = useCallback((data:SocketErrorHandlerType)=>{
    console.error(data)
  },[])


  useEffect(() => {
    if (!socket) return;
    socket.on("deleted-message",DeleteMessageHandler)
    socket.on("seen-messages",MessageSeenHandler)
    socket.on("update-message",UpdateMessageHandler)

    socket.on("error",SocketErrorHandler)

    socket.on("receive-message",newMessageHandler)
    socket.on("receive-message-files",MessageFileReceiveHandler)
    return () => {
      socket.off("deleted-message",DeleteMessageHandler)
      socket.off("seen-messages",MessageSeenHandler)
      socket.off("update-message",UpdateMessageHandler)

      socket.off("error",SocketErrorHandler)

      socket.off("receive-message",newMessageHandler)
      socket.off("receive-message-files",MessageFileReceiveHandler)

    };
  }, [current,socket,contactState,messages,DeleteMessageHandler,MessageFileReceiveHandler,MessageSeenHandler,SocketErrorHandler,UpdateMessageHandler,newMessageHandler]);
  

  const swiperRef = useRef<any|null>(null)

  const goTo = (index:number) =>{
      swiperRef.current.slideTo(index)
  }

  useEffect(()=>{
    if(currentTab=="chats" )
        goTo(0);
    else if(currentTab=='profile')
      goTo(1);

  },[current,currentTab])


  return (
    <>
{!isConnected && <div className='absolute top-0 w-full left-0'>Offline</div>}

    {
      <ProfileNav profile={user?.profile}/>
    }

    <div className='w-full h-full flex overflow-scroll no-scrollbar '>
    {socket && <Suspense fallback={''}> <CallMain/></Suspense>}

    <div className='overflow-hidden flex flex-row w-full'>
       <Suspense fallback={<LoadingSmall/>}> 
          <ChatSidebar /> 
          </Suspense>
    

      <div className={`md:flex-1 flex-initial flex-col md:flex overflow-hidden no-scrollbar w-full min-h-screen ${current || currentTab!='chats'?" block ":" hidden "}`}>
        <Swiper
        direction={'vertical'}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        pagination={{
          clickable: true,
        }}
        simulateTouch={false}
        touchRatio= {0}
        allowTouchMove = {false}
        speed={1000}
        className={`mySwiper w-full h-full md:block `}
      >
        <SwiperSlide>
          <div className={` h-[100vh] bg-light-chatBg dark:bg-dark-chatBg `} >
          {current?<Suspense fallback={<LoadingComponent/>}><ChatMainPage key={'chat-current'} /></Suspense>:<ChatInitialUi key={"initial-ui"}/>}
          </div>

        </SwiperSlide>

        <SwiperSlide>
         
            <Profile_SettingsMainPage key={"profile-tab"}/>
 
        </SwiperSlide>
        
        </Swiper>
      </div>
     
      
    </div>


    {
      <FilesCarousal openPreview={Boolean(files?.list)} ViewList={files?.list} needDialogBox={false} onCancelClick={()=>{setFiles(null)}} selectedItem={files?.current}/>
    }
    </div>
    </>
  )
}

export default MainPage