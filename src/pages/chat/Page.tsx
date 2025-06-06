
import ChatHeader from '../../components/chats/ChatHeader'
import ChatBody from '../../components/chats/ChatBody'
import { AppDispatch, useAppSelector } from '../../redux/store'
import {  useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateCurrent } from '../../redux/slice/chat/mainChats'
import { updateScrollIt } from '../../redux/slice/message/mainMessage';
import ChatInput from '../../components/chats/ChatInput'


export default function ChatMainPage() {
  const current = useAppSelector((state)=>state.chats.current)
  const allMessageList = useAppSelector(state=>state.messages.list)

  const currentMessageList = allMessageList.find(ele=>ele.chatId==current?.chatId)

  const messages = currentMessageList?.messages

  const dispatch = useDispatch<AppDispatch>()


  const scrollIt = useAppSelector(state=>state.messages.scrollIt)


  const handleEscapeKey = useCallback((event:KeyboardEvent) => {
    if (event.key === "Escape") {
      dispatch(updateCurrent(null))
    }
  },[dispatch]);

  const MobileFunction = useCallback((e:HashChangeEvent):void =>{
    if(e.oldURL.length > e.newURL.length)
        alert("back")
  },[])

  useEffect(()=>{
    if (scrollIt) {
      const scrollElement = document.getElementById(messages?messages[messages.length-1]._id:'')
      scrollElement?.scrollIntoView({ behavior: 'smooth',block: 'end'  });
    }
    return()=>{
      dispatch(updateScrollIt(false))
    }

  },[scrollIt,messages,current,dispatch])

  useEffect(() => {
    window.addEventListener("hashchange",MobileFunction );
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      window.removeEventListener("hashchange", MobileFunction);
    };
  }, [MobileFunction,handleEscapeKey]);





  return (
    <>
    
<div className={`animate-fade-in opacity-0 flex relative flex-col h-[100svh] bg-light-chatBg dark:bg-dark-chatBg text-light-textPrimary dark:text-dark-textPrimary`} >
      {current &&
        <>
          <ChatHeader current={current}/>
          <ChatBody/>
          {<ChatInput/>}
        </>
      }
  </div>    
  </>

  )
}
